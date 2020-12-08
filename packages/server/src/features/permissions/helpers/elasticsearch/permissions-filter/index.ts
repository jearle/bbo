import { PermissionsModel } from '../../../services/rca-web-accounts/permissions-model';

type MatchObject = {
  match: { [key: string]: string };
};

type CreateMatchObjectsResult = MatchObject[];

const createMatchObjects = (
  permissionsModel: PermissionsModel,
  mappings: { permissionsModelProperty: string; elasticSearchId: string }[]
): CreateMatchObjectsResult => {
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

type CreatePermissionsFilterInputs = {
  permissionsModel: PermissionsModel;
};

type CreatePermissionsFilterResult = {
  bool: {
    must: CreateMatchObjectsResult;
  };
};

export const createPermissionsFilter = ({
  permissionsModel,
}: CreatePermissionsFilterInputs): CreatePermissionsFilterResult => {
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
