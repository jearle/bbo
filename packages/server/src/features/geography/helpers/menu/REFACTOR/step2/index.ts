import {
  Geography,
  Types as GeographyTypes,
  ZoneTheatreName,
  CountryRegionName,
  MetroMarketName,
  GlobalGeographyName,
  AmericasZoneName,
  EmeaZoneName,
  AsiaPacZoneName,
  mapGeographyToOption,
} from '../step1';

type Option = {
  readonly id: string;
  readonly label: string;
  readonly value: Geography;
  readonly options: Option[];
};

export const buildGeographyOptions = (geographies: Geography[]) => {
  let zoneTheatreGeos: Option[] = [];
  let countryRegionGeos: Option[] = [];
  let metroMarketGeos: Option[] = [];

  let lastGeographyOption: Option = null;
  let indentedStack: Option[] = [];
  let lastIndentLevel: number = null;

  geographies.forEach((geography: Geography) => {
    if (lastGeographyOption) {
      if (geography.indent > lastIndentLevel) {
        indentedStack.push(lastGeographyOption);
      } else if (geography.indent < lastIndentLevel) {
        indentedStack.pop();
      }
    }

    lastGeographyOption = {
      label: geography.name,
      id: geography.menuId.toString(),
      value: geography,
      options: [],
    };

    if (geography.indent === 0) {
      switch (geography.type) {
        case GeographyTypes.RCAZone:
        case GeographyTypes.RCATheatre:
        case GeographyTypes.RCASubTheatre:
        case GeographyTypes.Continent:
          zoneTheatreGeos.push(lastGeographyOption);
          break;
        case GeographyTypes.Region:
        case GeographyTypes.Country:
        case GeographyTypes.MarketTier:
          countryRegionGeos.push(lastGeographyOption);
          break;
        case GeographyTypes.StateProv:
        case GeographyTypes.Metro:
        case GeographyTypes.Market:
        case GeographyTypes.SubMarket:
          metroMarketGeos.push(lastGeographyOption);
          break;
        default:
          throw `Unhandled Top Level Item: ${geography.type} ${geography.name}`;
      }
    } else {
      indentedStack[indentedStack.length - 1].options.push(lastGeographyOption);
    }

    lastIndentLevel = geography.indent;
  });

  return {
    [AmericasZoneName]: [
      {
        id: ZoneTheatreName,
        label: ZoneTheatreName,
        options: zoneTheatreGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === AmericasZoneName && name !== GlobalGeographyName;
        }),
      },
      {
        id: CountryRegionName,
        label: CountryRegionName,
        options: countryRegionGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === AmericasZoneName && name !== GlobalGeographyName;
        }),
      },
      {
        id: MetroMarketName,
        label: MetroMarketName,
        options: metroMarketGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === AmericasZoneName && name !== GlobalGeographyName;
        }),
      },
    ],
    [EmeaZoneName]: [
      {
        id: ZoneTheatreName,
        label: ZoneTheatreName,
        options: zoneTheatreGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === EmeaZoneName && name !== GlobalGeographyName;
        }),
      },
      {
        id: CountryRegionName,
        label: CountryRegionName,
        options: countryRegionGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === EmeaZoneName && name !== GlobalGeographyName;
        }),
      },
      {
        id: MetroMarketName,
        label: MetroMarketName,
        options: metroMarketGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === EmeaZoneName && name !== GlobalGeographyName;
        }),
      },
    ],
    [AsiaPacZoneName]: [
      {
        id: ZoneTheatreName,
        label: ZoneTheatreName,
        options: zoneTheatreGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === AsiaPacZoneName && name !== GlobalGeographyName;
        }),
      },
      {
        id: CountryRegionName,
        label: CountryRegionName,
        options: countryRegionGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === AsiaPacZoneName && name !== GlobalGeographyName;
        }),
      },
      {
        id: MetroMarketName,
        label: MetroMarketName,
        options: metroMarketGeos.filter((option) => {
          const geography: Geography = option.value as Geography;
          const { name, zoneTab } = geography;
          return zoneTab === AsiaPacZoneName && name !== GlobalGeographyName;
        }),
      },
    ],
    [GlobalGeographyName]: (() => {
      const globalGeography = geographies.find(
        (item) => item.name === GlobalGeographyName
      );
      return mapGeographyToOption(globalGeography);
    })(),
  };
};
