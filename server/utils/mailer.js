import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.OUT_EMAIL,
    pass: process.env.OUT_PASSWORD
  }
})
