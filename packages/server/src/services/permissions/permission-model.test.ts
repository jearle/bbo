import {
  createPermissionModelFromListOfRaw,
  PermissionModel,
  RawPermissionModel,
} from './permission-model';

test(`createPermissionModelFromListOfRaw`, () => {
  const rawPermissionModels: RawPermissionModel[] = [
    {
      StateProv_csv: null,
      Country_csv: '',
      MarketTier_csv: '1',
      Metro_csv: '1,2',
      TransType_csv: null,
      PtsMenu_csv: null,
    },
    {
      StateProv_csv: null,
      Country_csv: '',
      MarketTier_csv: '2',
      Metro_csv: '3,4',
      TransType_csv: null,
      PtsMenu_csv: null,
    },
  ];

  const permissionModel: PermissionModel = createPermissionModelFromListOfRaw(
    rawPermissionModels
  );

  expect(permissionModel.stateProvidence).toHaveLength(0);
  expect(permissionModel.country).toHaveLength(0);
  expect(permissionModel.marketTier).toHaveLength(2);
  expect(permissionModel.metro).toHaveLength(4);
  expect(permissionModel.transType).toHaveLength(0);
  expect(permissionModel.propertyTypeSearch).toHaveLength(0);
});
