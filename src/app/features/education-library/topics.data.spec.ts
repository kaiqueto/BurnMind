import { TOPICS, filterTopics, findTopic } from './topics.data';

describe('topics.data', () => {
  it('tem os 5 temas do wireframe', () => {
    expect(TOPICS.map((t) => t.title)).toEqual(['Burnout', 'Ansiedade', 'Depressão', 'Estresse crônico', 'Dificuldades de sono']);
  });

  it('só o Burnout tem conteúdo detalhado (os demais aguardam revisão de conteúdo)', () => {
    expect(TOPICS.filter((t) => t.content).map((t) => t.slug)).toEqual(['burnout']);
    expect(findTopic('burnout')?.content?.signs.length).toBe(3);
  });

  it('busca sem acento e sem diferenciar caixa', () => {
    expect(filterTopics(TOPICS, 'depressao').map((t) => t.slug)).toEqual(['depression']);
    expect(filterTopics(TOPICS, 'SONO').map((t) => t.slug)).toEqual(['sleep-difficulties']);
    expect(filterTopics(TOPICS, 'trabalho').map((t) => t.slug)).toContain('burnout');
    expect(filterTopics(TOPICS, '').length).toBe(5);
    expect(filterTopics(TOPICS, 'xyz')).toEqual([]);
  });
});
