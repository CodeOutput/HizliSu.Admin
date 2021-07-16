import { HizliSuTemplatePage } from './app.po';

describe('HizliSu App', function() {
  let page: HizliSuTemplatePage;

  beforeEach(() => {
    page = new HizliSuTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
