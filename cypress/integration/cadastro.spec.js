/// <reference types="cypress" />

const Chance = require('chance')
const chance = new Chance()


context('Cadastro', () => {
  it('Cadastro de usuário no site', () =>  {
    cy.server()
    // routes
    cy.route('POST', '**/api/1/databases/userdetails/collections/newtable?**')
      .as('postNewTable')

    cy.route('POST', '**/api/1/databases/userdetails/collections/usertable?**')
      .as('postUserTable')

    cy.route('GET', '**/api/1/databases/userdetails/collections/newtable?**')
      .as('getNewTable')


    cy.visit('Register.html')

    // inputs type=input
    cy.get('input[placeholder="First Name"]').type(chance.first())
    cy.get('input[ng-model^=Last]').type(chance.last())
    cy.get('input[ng-model^=Email]').type(chance.email())
    cy.get('input[ng-model^=Phone]').type(chance.phone({ formatted: false }))

    // inputs type=checkbox`s and radio`s
    cy.get('input[value=FeMale]').check()
    cy.get('input[type=checkbox]').check('Cricket')
    cy.get('input[type=checkbox]').check('Hockey')

    // inputs type=select
    cy.get('select#Skills').select('Javascript')
    cy.get('select#countries').select('Argentina')
    cy.get('select#country').select('Australia', { force: true })
    cy.get('select#yearbox').select('1996')
    cy.get('select[ng-model^=month]').select('February')
    cy.get('select#daybox').select('23')

    // inputs type=password
    cy.get('input#firstpassword').type('Agilizei@2020')
    cy.get('input#secondpassword').type('Agilizei@2020')

    // input type=imagesrc
    cy.get('input#imagesrc').attachFile('image.jpeg')

    // submit register
    cy.get('button#submitbtn').click()

    // validating routes using chai lib
    cy.wait('@postNewTable').then((resNewTable) => {
      expect(resNewTable.status).to.equal(200)
    })

    cy.wait('@postUserTable').then((resUserTable) => {
      expect(resUserTable.status).to.equal(200)
    })

    cy.wait('@getNewTable').then((resNewTable) => {
      expect(resNewTable.status).to.equal(200)
    })

    cy.url().should('contain', 'WebTable')
  })
})
