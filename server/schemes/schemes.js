import z from 'zod'

const userSchema = z.object({
  name: z.string({
    invalid_type_error: 'Username must be a string.',
    required_error: 'Username is required.'
  }),
  email: z.string().email(),
  password: z.string({
    invalid_type_error: 'Password must be a string.',
    required_error: 'Password is required.'
  }).min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string({
    invalid_type_error: 'Password confirmation must be a string.',
    required_error: 'Password confirmation is required.'
  }),
  phoneNum: z.string({
    required_error: 'Phone number is required.'
  }).min(9, 'Phone number must be at least 9 characters').max(11, 'Phone number must be at most 11 characters')
})

const serviceSchema = z.object({
  name: z.string({
    invalid_type_error: 'name must be a string',
    required_error: 'name is required'
  }),
  duration: z.number({
    invalid_type_error: 'duration must be a number',
    required_error: 'duration is required'
  }).min(1),
  price: z.number({
    invalid_type_error: 'price must be a number',
    required_error: 'price is required'
  }).min(1)
})

const passwordSchema = z.object({
  currentPassword: z.string({
    invalid_type_error: 'Password must be a string.',
    required_error: 'Password is required.'
  }),
  newPassword: z.string({
    invalid_type_error: 'Password must be a string.',
    required_error: 'Password is required.'
  }),
  passwordConfirm: z.string({
    invalid_type_error: 'Password must be a string.',
    required_error: 'Password is required.'
  })
})

const calendarSchema = z.object({
  interval: z.number({
    invalid_type_error: 'Interval must be a number',
    required_error: 'Interval is required'
  }).min(1),
  deadline: z.string({
    invalid_type_error: 'Deadline must be a string',
    required_error: 'Deadline is required'
  })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}

export function validateService (object) {
  return serviceSchema.safeParse(object)
}

export function validatePartialService (object) {
  return serviceSchema.partial().safeParse(object)
}

export function validatePassword (object) {
  return passwordSchema.safeParse(object)
}

export function validateCalendar (object) {
  return calendarSchema.safeParse(object)
}
