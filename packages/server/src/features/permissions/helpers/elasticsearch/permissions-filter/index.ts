import { size } from 'lodash';
import { PermissionsSet } from '../../../services/rca-web-accounts/permissions-model';

type MatchObject = {
  match: { [key: string]: string };
};

type CreateMatchObjectsResult = MatchObject[];


type CreatePermissionsFilterInputs = {
  permissionsSet: PermissionsSet;
};

type CreatePermissionsFilterResult = {
  bool: {
    should: CreateMatchObjectsResult;
  };
};

export const createPermissionsFilter = ({
  permissionsSet,
}: CreatePermissionsFilterInputs): CreatePermissionsFilterResult => {

  if (!permissionsSet || permissionsSet.fullPermissions) {
    return null;
  }

  const permissionSetResults = permissionsSet.permissionModels.map((geoPermissions) => {
    const permissionResults: any[] = [
      {
        terms: {
          propertyTypeSearch_id: geoPermissions.propertyTypeSearch,
        },
      },
    ];

    const transType = geoPermissions.transType;
    if (size(transType) > 0) {
      // removed known holdings filter since not a part of trends, reference cd-stack if needed later

      permissionResults.push({
        terms: {
          transType_id: transType,
        },
      });
    }

    let geoPermissionsQuery: { bool: { should?: {}[] } } = {
      bool: { should: [] },
    };
    let geoPermissionsPush = false;
    if (size(geoPermissions.country) > 0) {
      geoPermissionsPush = true;
      geoPermissionsQuery.bool.should.push({
        terms: {
          adminLevel0_id: geoPermissions.country,
        },
      });
    }

    if (size(geoPermissions.metro) > 0) {
      geoPermissionsPush = true;
      geoPermissionsQuery.bool.should.push({
        terms: {
          newMetro_id: geoPermissions.metro,
        },
      });
    }

    if (size(geoPermissions.stateProvidence) > 0) {
      geoPermissionsPush = true;
      geoPermissionsQuery.bool.should.push({
        terms: {
          adminLevel1_id: geoPermissions.stateProvidence,
        },
      });
    }

    if (size(geoPermissions.marketTier) > 0) {
      geoPermissionsPush = true;
      geoPermissionsQuery.bool.should.push({
        terms: {
          newMarketTier_id: geoPermissions.marketTier,
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
