declare module 'virtual:bridge-data' {
  const data: {
    variables: import('../../src/schema.ts').VariablesDoc;
    components: import('../../src/schema.ts').ComponentsDoc | null;
  };
  export default data;
}
