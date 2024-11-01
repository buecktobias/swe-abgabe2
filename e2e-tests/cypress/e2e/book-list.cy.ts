import { BuchEntity } from '../support/buchEntity';

describe('Books Page Tests', () => {
  let booksData: BuchEntity[];

  before(() => {
    cy.fixture('default-books').then((data) => {
      booksData = data;
    });

    cy.resetDatabase();
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('checks that each displayed book exists in the database and displays correct details', () => {
    cy.get('[data-test="book-details"]').should('exist').and('have.length.at.least', 1);

    cy.get('[data-test="book-details"]').each(($bookElement) => {
      const displayedBookId = $bookElement.attr('data-book-id');
      const displayedBookIsbn = $bookElement.attr('data-isbn');

      const matchingBook = booksData.find(
        (book) => book.id.toString() === displayedBookId && book.isbn === displayedBookIsbn,
      );

      expect(matchingBook).to.exist;

      cy.wrap($bookElement).within(() => {
        if (matchingBook.titel?.titel) {
          cy.get('[data-test="book-title"]').should('contain', matchingBook.titel.titel);
        }

        cy.get('[data-test="book-isbn"]').should('contain', matchingBook.isbn);

        if (matchingBook.preis) {
          cy.get('[data-test="book-price"]').should('contain', matchingBook.preis.toString());
        }

        if (matchingBook.schlagwoerter && matchingBook.schlagwoerter.length > 0) {
          matchingBook.schlagwoerter.forEach((keyword) => {
            cy.get('[data-test="book-keywords"]').should('contain', keyword);
          });
        }
      });
    });
  });
});
