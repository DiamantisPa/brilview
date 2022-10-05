import { BrilviewClientPage } from './app.po';

describe('brilview-client App', function() {
  let page: BrilviewClientPage;

  beforeEach(() => {
    page = new BrilviewClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
