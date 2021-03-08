/// <reference types="cypress" />

import { NavigationPage } from '../../pages/navigation.page'

const TRANSLATIONS = {
  ja: {
    name: '日本語',
    about: '情報',
  },
  en: {
    name: 'English',
    about: 'About',
  },
  ko: {
    name: '한국어',
    about: '정보',
  },
}
const CASES = [
  {
    language: 'ja',
    matchedLanguage: 'ja',
  },
  {
    language: 'en',
    matchedLanguage: 'en',
  },
  {
    language: 'ko',
    matchedLanguage: 'ko',
  },
  {
    language: 'en-US',
    matchedLanguage: 'en',
  },
  {
    language: 'de',
    matchedLanguage: 'ja',
  },
]

describe('Localization', () => {
  const navigationPage = new NavigationPage()

  function specifyPage(path, matchedLanguage, translation) {
    specify(`Path is "${path}"`, () => {
      cy.url().should('contain', path)
    })

    specify(`Html lang attribute is "${matchedLanguage}"`, () => {
      cy.get('html').should('have.attr', 'lang', matchedLanguage)
    })

    specify(`Language option "${translation.name}" is selected`, () => {
      navigationPage.getLanguageMenuButton().should('contain', translation.name)
    })

    specify(`About tab is named "${translation.about}"`, () => {
      navigationPage.getTabLink('about').should('contain', translation.about)
    })
  }

  describe('Browser Languages', () => {
    CASES.forEach(({ language, matchedLanguage }) => {
      const translation = TRANSLATIONS[matchedLanguage]

      context(`Homepage with Language: "${language}"`, () => {
        before(() => {
          navigationPage.visit('/', language)
        })

        specifyPage(
          `/${matchedLanguage}/locations`,
          matchedLanguage,
          translation
        )
      })
    })
  })

  context('Switching from "ja" to "en"', () => {
    before(() => {
      navigationPage.visit('/ja/about')
      navigationPage.switchLanguage('en')
    })

    specifyPage('/en/about', 'en', TRANSLATIONS.en)
  })
})
