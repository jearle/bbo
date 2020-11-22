import { PermissionsModel } from '../../../services/rca-web-accounts/permissions-model';

const createMatchObjects = (
  permissionsModel: PermissionsModel,
  mappings: { permissionsModelProperty: string; elasticSearchId: string }[]
) => {
  const matchObjects = mappings.reduce(
    (acc, { permissionsModelProperty, elasticSearchId }) => {
      return [
        ...acc,
        ...permissionsModel[permissionsModelProperty].map((id) => ({
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

export const createPermissionsFilter = ({
  permissionsModel,
}: {
  permissionsModel: PermissionsModel;
}) => {
  const must = createMatchObjects(permissionsModel, [
    {
      permissionsModelProperty: `stateProvidence`,
      elasticSearchId: `adminLevel1_id`,
    },
    {
      permissionsModelProperty: `country`,
      elasticSearchId: `adminLevel0_id`,
    },
    {
      permissionsModelProperty: `marketTier`,
      elasticSearchId: `newMarketTier_id`,
    },
    {
      permissionsModelProperty: `metro`,
      elasticSearchId: `newMetro_id`,
    },
    {
      permissionsModelProperty: `transType`,
      elasticSearchId: `newTransType_id`,
    },
    {
      permissionsModelProperty: `propertyTypeSearch`,
      elasticSearchId: `propertyTypeSearch_id`,
    },
  ]);

  const filter = {
    bool: { must },
  };

  return filter;
};
