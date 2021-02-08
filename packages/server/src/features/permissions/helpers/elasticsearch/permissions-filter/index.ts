import { size, map } from 'lodash';
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

const createGeoPermissionBuilder = () => {
  if (!this.geoPermissionsSet || this.geoPermissionsSet.fullPermissions) {
    return null;
  }

  const permissionSetResults = map<IGeoPermissions.IGeoPermissions, any>(
    this.geoPermissionsSet.geoPermissions,
    (geoPermissions: IGeoPermissions.IGeoPermissions) => {
      const permissionResults: any[] = [
        {
          terms: {
            propertyTypeSearch_id: geoPermissions.searchIds,
          },
        },
      ];

      const transTypeIds = geoPermissions.transTypeIds;
      if (size(transTypeIds) > 0) {
        // non-construction subscriptions are allowed to
        // see completed construction deals in known holdings
        if (this.isKnownHoldingSearch && !contains(transTypeIds, 8)) {
          // add construciton trans type
          transTypeIds.push(8);
          // allow transactions that are not construction (8) OR
          // construction that are completed
          permissionResults.push({
            bool: {
              should: [
                {
                  bool: {
                    must_not: {
                      term: {
                        transType_id: 8,
                      },
                    },
                  },
                },
                {
                  bool: {
                    must: [
                      {
                        term: {
                          transType_id: 8,
                        },
                      },
                      {
                        term: {
                          constructionStatus_id:
                            ConstructionStatuses.Complete,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          });
        }

        permissionResults.push({
          terms: {
            transType_id: transTypeIds,
          },
        });
      }

      let geoPermissionsQuery: { bool: { should?: {}[] } } = {
        bool: { should: [] },
      };
      let geoPermissionsPush = false;
      if (size(geoPermissions.countryIds) > 0) {
        geoPermissionsPush = true;
        geoPermissionsQuery.bool.should.push({
          terms: {
            adminLevel0_id: geoPermissions.countryIds,
          },
        });
      }

      if (size(geoPermissions.metroIds) > 0) {
        geoPermissionsPush = true;
        geoPermissionsQuery.bool.should.push({
          terms: {
            newMetro_id: geoPermissions.metroIds,
          },
        });
      }

      if (size(geoPermissions.stateProvIds) > 0) {
        geoPermissionsPush = true;
        geoPermissionsQuery.bool.should.push({
          terms: {
            adminLevel1_id: geoPermissions.stateProvIds,
          },
        });
      }

      if (size(geoPermissions.marketTierIds) > 0) {
        geoPermissionsPush = true;
        geoPermissionsQuery.bool.should.push({
          terms: {
            newMarketTier_id: geoPermissions.marketTierIds,
          },
        });
      }

      if (geoPermissionsPush) {
        permissionResults.push(geoPermissionsQuery);
      }

      if (permissionResults.length > 0) {
        return { bool: { must: permissionResults } };
      } else {
        return permissionResults[0];
      }
    },
  );

  if (permissionSetResults.length === 0) {
    return null;
  } else if (permissionSetResults.length === 1) {
    return permissionSetResults[0];
  } else {
    return { bool: { should: permissionSetResults } };
  }
}
