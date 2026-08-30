import {
  hasBookingAssistantProfile,
  mapPersonalToCitaPreviaBookingAssistantProfile,
  mapPersonalToEmpadronamientoBookingAssistantProfile,
} from '@/scripts/bookingAssistantProfile'

describe('bookingAssistantProfile mappers', () => {
  const personal = {
    firstName: 'Jane',
    lastName: 'Doe',
    secondLastName: 'Smith',
    documentType: 'passport',
    documentNumber: 'A12345678',
    phoneNumber: '600123456',
    email: 'jane@example.com',
  }

  it('maps personal data for empadronamiento', () => {
    expect(
      mapPersonalToEmpadronamientoBookingAssistantProfile(personal),
    ).toEqual({
      personalInfo: {
        identifierType: 'PASSAPORT',
        identifier: 'A12345678',
        name: 'Jane',
        surname: 'Doe',
        secondSurname: 'Smith',
        email: 'jane@example.com',
        phone: '600123456',
      },
      motive: 'Booking appointment to request empadronamiento.',
    })
  })

  it('uses fallback email for empadronamiento when profile email is missing', () => {
    const withoutEmail = {
      firstName: personal.firstName,
      lastName: personal.lastName,
      secondLastName: personal.secondLastName,
      documentType: personal.documentType,
      documentNumber: personal.documentNumber,
      phoneNumber: personal.phoneNumber,
    }

    expect(
      mapPersonalToEmpadronamientoBookingAssistantProfile(
        withoutEmail,
        'fallback@example.com',
      )?.personalInfo.email,
    ).toBe('fallback@example.com')
  })

  it('maps personal data for cita previa', () => {
    expect(mapPersonalToCitaPreviaBookingAssistantProfile(personal)).toMatchObject({
      details: {
        nie: '',
        Name: 'Jane Doe',
        documentType: 'passport',
      },
    })
  })

  it('validates booking assistant profile readiness', () => {
    expect(
      hasBookingAssistantProfile(personal, 'empadronamiento'),
    ).toBe(true)
    expect(hasBookingAssistantProfile(personal, 'cita-previa')).toBe(true)
    expect(hasBookingAssistantProfile(null, 'cita-previa')).toBe(false)
    expect(
      hasBookingAssistantProfile({firstName: 'Jane'}, 'empadronamiento'),
    ).toBe(false)
  })
})
