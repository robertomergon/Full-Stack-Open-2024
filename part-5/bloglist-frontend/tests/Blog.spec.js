import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
        await page.request.post('http://localhost:3003/api/testing/reset')
        await page.request.post('http://localhost:3003/api/users', {
            data: { 
                username: "root",
                name: "root",
                _id: "6776f8b2749f64a011d65504",
                password: "root",
            }
        });

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await page.waitForSelector('form')

        const form = await page.$('form')
        expect(form).not.toBeNull()

        const content = await form?.textContent()
        expect(content).toContain('username')
        expect(content).toContain('password')
    })

    test.describe('Log in', () => {

        test('user can login', async ({ page }) => {
            const user = {
                username: 'root',
                password: 'root'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')
            const text = (await page.waitForSelector('p'))
            expect(text).not.toBeNull()
            expect(await text.textContent()).toContain('Logged in as ', user.username)
        })

        test('login fails with wrong password', async ({ page }) => {
            const user = {
                username: 'root',
                password: 'wrong'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')

            await expect(page.getByText('Wrong username or password, please try again')).toBeVisible()
        })

        test('login fails with wrong username', async ({ page }) => {
            const user = {
                username: 'wrong',
                password: 'root'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')

            await expect(page.getByText('Wrong username or password, please try again')).toBeVisible()
        })
    })

    test.describe('When logged in', () => {
        test.beforeEach(async ({ page }) => {
            const user = {
                username: 'root',
                password: 'root'
            }
            await page.getByRole('textbox', { name: 'username' }).fill(user.username)
            await page.getByRole('textbox', { name: 'password' }).fill(user.password)

            await page.click('button')
            await page.waitForSelector('p')
        })

        test('A blog can be created', async ({ page }) => {
            await page.click('button', { text: 'create new blog' })

            await page.getByRole('textbox', { name: 'title' }).fill('A blog created by test')
            await page.getByRole('textbox', { name: 'author' }).fill('test author')
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com')

            await page.getByRole('button', { name: 'Create' }).click()

            await page.waitForSelector('.blog', { text: 'A blog created by test' })
            const blogLocator = await page.locator('.blog', { hasText: 'A blog created by test' })
            await expect(blogLocator).toBeVisible()
        })

        test('A blog can be liked', async ({ page }) => {
            await page.click('button', { text: 'create new blog' })

            await page.getByRole('textbox', { name: 'title' }).fill('A blog created by test')
            await page.getByRole('textbox', { name: 'author' }).fill('test author')
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com')

            await page.getByRole('button', { name: 'Create' }).click()
            await page.waitForSelector('.blog', { text: 'A blog created by test' })

            await page.getByRole('button', { name: 'view' }).click()
            await page.waitForSelector('.likeButton')

            await expect(page.locator('.likeButton')).toBeVisible()
            await expect(page.getByText('0 likes')).toBeVisible()

            await page.click('.likeButton')

            await expect(page.getByText('1 likes')).toBeVisible()
            
        })

        test('A blog can be deleted', async ({ page }) => {
            await page.click('button', { text: 'create new blog' });
            await page.getByRole('textbox', { name: 'title' }).fill('A blog created by test');
            await page.getByRole('textbox', { name: 'author' }).fill('test author');
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com');
            await page.getByRole('button', { name: 'Create' }).click();

            const blogLocator = page.locator('.blog', { hasText: 'A blog created by test' });
            await expect(blogLocator).toBeVisible();

            await blogLocator.getByRole('button', { name: 'view' }).click();

            page.on('dialog', async (dialog) => {
                expect(dialog.type()).toBe('confirm');
                expect(dialog.message()).toContain('Remove blog A blog created by test by test author');
                await dialog.accept();
            });

            await blogLocator.getByRole('button', { name: 'remove' }).click();

            await expect(blogLocator).not.toBeVisible();
        });
        
        test('Only the creator of the blog sees the delete button', async ({ page }) => {
                await page.request.post('http://localhost:3003/api/users', {
                    data: { 
                        username: "test",
                        name: "test",
                        _id: "6776f8b2749f64a011d65505",
                        password: "test",
                    }
                });
            

            await page.click('button', { text: 'create new blog' });
            await page.getByRole('textbox', { name: 'title' }).fill('A blog created by test');
            await page.getByRole('textbox', { name: 'author' }).fill('test author');
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com');
            await page.getByRole('button', { name: 'Create' }).click();

            const blogLocator = page.locator('.blog', { hasText: 'A blog created by test' });
            await expect(blogLocator).toBeVisible();

            await page.getByRole('button', { name: 'logout' }).click();

            await page.getByRole('textbox', { name: 'username' }).fill('test');
            await page.getByRole('textbox', { name: 'password' }).fill('test');
            await page.click('button');

            await page.waitForSelector('.blog', { text: 'A blog created by test' })
            await expect(blogLocator).toBeVisible();

            await blogLocator.getByRole('button', { name: 'view' }).click();
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
        })
    
        test('Blogs are ordered by likes', async ({ page }) => {
            // Create one blog with 0 likes
            await page.click('button', { text: 'create new blog' });
            await page.getByRole('textbox', { name: 'title' }).fill('A blog created by test');
            await page.getByRole('textbox', { name: 'author' }).fill('test author');
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com');
            await page.getByRole('button', { name: 'Create' }).click();

            await page.waitForSelector('.blog', { text: 'A blog created by test' });

            // Wait 5 seconds to ensure the blog is created before creating another one
            await page.waitForTimeout(5000);

            // Create another blog with 1 like
            await page.getByRole('textbox', { name: 'title' }).fill('Another blog created by test');
            await page.getByRole('textbox', { name: 'author' }).fill('test author');
            await page.getByRole('textbox', { name: 'url' }).fill('http://test.com');
            await page.getByRole('button', { name: 'Create' }).click({ force: true });

            await page.waitForSelector('.blog', { text: 'Another blog created by test' });

            const blogLocator = page.locator('.blog', { hasText: 'Another blog created by test' });
            await blogLocator.getByRole('button', { name: 'view' }).click();
            await blogLocator.getByRole('button', { name: 'like' }).click();
            

            // Check if the second blog is now the first one
            const firstBlog = await page.locator('.blog').nth(0);
            await expect(firstBlog).toContainText('Another blog created by test');
            const firstBlogLikes = await firstBlog.locator('.likeText').textContent()

            // Check if the first blog is now the second one
            const secondBlog = await page.locator('.blog').nth(1);
            await expect(secondBlog).toContainText('A blog created by test');
            await secondBlog.getByRole('button', { name: 'view' }).click();
            const secondBlogLikes = await secondBlog.locator('.likeText').textContent()

            await expect(Number(firstBlogLikes.split(' ')[0])).toBeGreaterThan(Number(secondBlogLikes.split(' ')[0]));
        });
    })
})