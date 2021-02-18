import { size } from 'lodash';
import { PermissionsSet, PermissionsModel } from '../../../services/rca-web-accounts/permissions-model';
import { getGeographySearchFieldByTx } from 'shared/dist/helpers/types/geography';

type MustObject = {
  bool: {
    must: [
      {
        [key: string]: any
      }
    ]
  }
};

type CreateMustObjectsResult = MustObject[];


type CreatePermissionsFilterInputs = {
  permissionsSet: PermissionsSet;
};

export type CreatePermissionsFilterResult = {
  bool: {
    should: CreateMustObjectsResult;
  };
};

export const createPermissionsFilter = ({
  permissionsSet,
}: CreatePermissionsFilterInputs): CreatePermissionsFilterResult => {

  if (!permissionsSet || permissionsSet.fullPermissions) {
    return null;
  }

  const permissionSetResults = permissionsSet.permissionModels.map((geoPermissions: PermissionsModel) => {
    const permissionResults: any[] = [
      {
        terms: {
          propertyTypeSearch_id: geoPermissions.PropertyTypeSearch,
        },
      },
    ];

    const transType = geoPermissions.TransType;
    if (size(transType) > 0) {
      // removed known holdings filter since not a part of trends, reference cd-stack if needed later
      permissionResults.push({
        terms: {
          transType_id: transType,
        },
      });
    }

    const geoPermissionsQuery: { bool: { should?: {}[] } } = {
      bool: { should: [] },
    };
    const geoTypes = ['Country', 'Metro', 'StateProv', 'MarketTier'];
    geoTypes.forEach(key => {
      if (size(geoPermissions[key]) > 0) {
        geoPermissionsQuery.bool.should.push({
          terms: {
            [getGeographySearchFieldByTx(key)]: geoPermissions[key],
          },
        });
      }
    });

    if (geoPermissionsQuery.bool.should.length > 0) {
      permissionResults.push(geoPermissionsQuery);
    }

    if (permissionResults.length > 1) {
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
};


