type GetDataTypesInputs = {
  readonly propertyType: string;
};

const dataTypeService = () => ({
  getDataTypes: ({ propertyType }: GetDataTypesInputs) => {
    return [
      `Price`,
      `# Properties`,
      `Total Area`,
      `Total Units`,
      `PPU`,
      `CapRate`,
    ];
  },
});
export type DataTypeService = ReturnType<typeof dataTypeService>;

export const createDataTypeService = (): DataTypeService => {
  return dataTypeService();
};
