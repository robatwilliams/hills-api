const parseNames = require('./parseNames');

describe('single names (pass through)', () => {
  test('one word', () => {
    expect(parseNames('Skiddaw')).toEqual(['Skiddaw']);
  });

  test('two words', () => {
    expect(parseNames('Glyder Fach')).toEqual(['Glyder Fach']);
  });

  test('hyphenated word', () => {
    expect(parseNames('Foel-goch')).toEqual(['Foel-goch']);
  });

  test('with punctuation', () => {
    expect(parseNames("Stuc a' Chroin")).toEqual(["Stuc a' Chroin"]);
  });

  test('with qualifier', () => {
    expect(parseNames('Red Pike (Buttermere)')).toEqual(['Red Pike (Buttermere)']);
  });

  test('combined name for multi-topped hill', () => {
    expect(parseNames('Blencathra - Hallsfell Top')).toEqual([
      'Blencathra - Hallsfell Top',
    ]);
  });
});

describe('alternate names (split out)', () => {
  test('one', () => {
    expect(parseNames('Hobcarton Crag [Hobcarton Head]')).toEqual([
      'Hobcarton Crag',
      'Hobcarton Head',
    ]);
  });

  test('two', () => {
    expect(parseNames('Whiteside East Top [Whiteside] [Gasgale Crags]')).toEqual([
      'Whiteside East Top',
      'Whiteside',
      'Gasgale Crags',
    ]);
  });

  test('hyphenated word', () => {
    expect(parseNames('Meall an Fhuarain Mhoir [Ceum na h-Aon Choise]')).toEqual([
      'Meall an Fhuarain Mhoir',
      'Ceum na h-Aon Choise',
    ]);
  });

  test('with punctuation', () => {
    expect(parseNames("Beinn a' Mheadhain [Beinn a' Mheadhoin]")).toEqual([
      "Beinn a' Mheadhain",
      "Beinn a' Mheadhoin",
    ]);
  });

  test('with qualifier', () => {
    expect(parseNames('Carn Dearg (NW) [Carn Dearg (North)]')).toEqual([
      'Carn Dearg (NW)',
      'Carn Dearg (North)',
    ]);
  });

  test('combined name for multi-topped hill', () => {
    expect(parseNames('Little Hart Crag [Little Hart Crag - West Top]')).toEqual([
      'Little Hart Crag',
      'Little Hart Crag - West Top',
    ]);
  });
});
