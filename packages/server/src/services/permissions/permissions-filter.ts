const createMatchObjects = (permissionModel, mappings) => {
  const matchObjects = mappings.reduce(
    (acc, { permissionModelProperty, elasticSearchId }) => {
      return [
        ...acc,
        ...permissionModel[permissionModelProperty].map((id) => ({
          match: {
            [elasticSearchId]: id,
          },
        })),
      ];
    },
    []
  );

  return matchObjects;
};

export const createPermissionFilter = ({ permissionModel }) => {
  const must = createMatchObjects(permissionModel, [
    {
      permissionModelProperty: `stateProvidence`,
      elasticSearchId: `adminLevel1_id`,
    },
    {
      permissionModelProperty: `country`,
      elasticSearchId: `adminLevel0_id`,
    },
    {
      permissionModelProperty: `marketTier`,
      elasticSearchId: `newMarketTier_id`,
    },
    {
      permissionModelProperty: `metro`,
      elasticSearchId: `newMetro_id`,
    },
    {
      permissionModelProperty: `transType`,
      elasticSearchId: `newTransType_id`,
    },
    {
      permissionModelProperty: `propertyTypeSearch`,
      elasticSearchId: `propertyTypeSearch_id`,
    },
  ]);

  const filter = {
    bool: { must },
  };

  return filter;
};
