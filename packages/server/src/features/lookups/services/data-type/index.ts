type GetDataTypesInputs = {
  readonly propertyType: string;
};

const getVolumeOptions = (propertyType: string) => {
  switch (propertyType) {
    case `commericial`:
    case `office`:
    case `industrial`:
    case `retail`:
    case `dev-site`: {
      return [`Total ָArea`];
    }

    case `apartment`: {
      return [`Total Area`, `Total Units`];
    }

    case `hotel`:
    case `seniors-housing-care`: {
      return [`Total Units`];
    }

    /* istanbul ignore next */
    default: {
      throw new Error(`unknown property type`);
    }
  }
};

const getPricingOptions = (propertyType: string) => {
  switch (propertyType) {
    case `commericial`:
    case `office`:
    case `industrial`:
    case `retail`:
    case `dev-site`: {
      return [`Price Per Square Foot`];
    }

    case `apartment`: {
      return [`Price Per Square Foot`, `Price Per Unit`];
    }

    case `hotel`:
    case `seniors-housing-care`: {
      return [`Price Per Unit`];
    }

    /* istanbul ignore next */
    default: {
      throw new Error(`unknown property type`);
    }
  }
};

type Option = {
  readonly id: string;
  readonly label: string;
  readonly options: Option[];
};

const toOptions = (strings: string[]): Option[] =>
  strings.map((id) => {
    const label = id;
    const options = [];

    return {
      id,
      label,
      options,
    };
  });

const createOptions = (propertyType: string) => {
  const options = [
    {
      label: `Volume`,
      id: `volume`,
      options: [
        {
          label: `Number of Properties`,
          id: `number-of-properties`,
          options: [],
        },
        ...toOptions(getVolumeOptions(propertyType)),
      ],
    },
    {
      label: `Pricing`,
      id: `pricing`,
      options: [
        ...toOptions(getPricingOptions(propertyType)),
        {
          label: `Cap Rate`,
          id: `cap-rate`,
          options: [],
        },
      ],
    },
  ];

  return options;
};

const dataTypeService = () => ({
  getDataTypes: ({ propertyType }: GetDataTypesInputs) => {
    return createOptions(propertyType);
  },
});
export type DataTypeService = ReturnType<typeof dataTypeService>;

export const createDataTypeService = (): DataTypeService => {
  return dataTypeService();
};
