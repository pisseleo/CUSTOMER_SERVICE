import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RequestForm } from './RequestForm'

describe('RequestForm', () => {
  it('renders form fields and submits valid data', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<RequestForm onSubmit={onSubmit} submitting={false} />)

    await user.type(screen.getByLabelText(/Title/i), 'Example issue')
    await user.type(screen.getByLabelText(/Description/i), 'Issue details')
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Billing')
    await user.type(screen.getByLabelText(/Requester name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/Requester email/i), 'jane@example.com')

    await user.click(screen.getByRole('button', { name: /submit request/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Example issue',
        description: 'Issue details',
        category: 'Billing',
        requesterName: 'Jane Doe',
        requesterEmail: 'jane@example.com',
      }),
    )
  })
})
