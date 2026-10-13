/**
 * @see https://github.com/allfunc/docker-mdbook
 */
window.elasticlunr.Index.load = (index) => {
  const FzF = window.fzf.Fzf;
  const storeDocs = index.documentStore.docs;
  const finders = new Map();

  const currentLocale = () =>
    document.documentElement.dataset.docLocale || 'zh-CN';

  const buildFinder = (locale) => {
    const indexArr = Object.keys(storeDocs).filter(
      (item) => (storeDocs[item].lang || 'zh-CN') === locale
    );
    return new FzF(indexArr, {
      selector: (item) => {
        const res = storeDocs[item];
        res.text = `${res.title}${res.breadcrumbs}${res.body}`;
        return res.text;
      },
    });
  };

  return {
    search: (searchterm) => {
      const locale = currentLocale();
      let finder = finders.get(locale);
      if (finder === undefined) {
        finder = buildFinder(locale);
        finders.set(locale, finder);
      }
      const entries = finder.find(searchterm);
      return entries.map((data) => {
        const { item, score } = data;
        return {
          doc: storeDocs[item],
          ref: item,
          score,
        };
      });
    },
  };
};
