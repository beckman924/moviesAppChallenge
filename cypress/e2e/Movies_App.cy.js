describe("Movies App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Can open a movie", () => {
    cy.get("#movie").first().click();
  });

  it("Can close modal", () => {
    cy.get("#movie").first().click();
    cy.get("#backButton").click();
  });
});
