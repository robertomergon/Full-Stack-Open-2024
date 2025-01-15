import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
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
})