type GetDataTypesInputs = {
  readonly propertyType: string;
};

const getVolumeOptions = (propertyType: string) => {
  switch (propertyType) {
    case `commercial`:
    case `office`:
    case `office-office-cbd`:
    case `office-office-sub`:
    case `industrial`:
    case `industrial-warehouse`:
    case `industrial-flex`:
    case `retail`:
    case `retail-centers`:
    case `retail-shops`:
    case `self-storage`:
    case `dev-site-land`: {
      return [`Total Area`];
    }

    case `all-property-types`:
    case `apartment`:
    case `apartment-garden`:
    case `apartment-mid-highrise`:
    case `parking-facility`: {
      return [`Total Area`, `Total Units`];
    }

    case `hotel`:
    case `hotel-limited-service`:
    case `hotel-full-service`:
    case `seniors-housing-care`:
    case `seniors-housing-care-nursing-care`:
    case `seniors-housing-care-seniors-housing`:
    case `manufactured-housing`: {
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
    case `commercial`:
    case `office`:
    case `office-office-cbd`:
    case `office-office-sub`:
    case `industrial`:
    case `industrial-warehouse`:
    case `industrial-flex`:
    case `retail`:
    case `retail-centers`:
    case `retail-shops`:
    case `self-storage`:
    case `dev-site-land`: {
      return [`Price Per Area`];
    }

    case `all-property-types`:
    case `apartment`:
    case `apartment-garden`:
    case `apartment-mid-highrise`:
    case `parking-facility`: {
      return [`Price Per Area`, `Price Per Unit`];
    }

    case `hotel`:
    case `hotel-limited-service`:
    case `hotel-full-service`:
    case `seniors-housing-care`:
    case `seniors-housing-care-nursing-care`:
    case `seniors-housing-care-seniors-housing`:
    case `manufactured-housing`: {
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
