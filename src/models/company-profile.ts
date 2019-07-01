import { UniqueIdentifier } from 'mssql';
import dbs from '../dbs';

export interface ICompanyProfile {
	company_tx: string;
	ceo_tx: string;
	website_tx: string;
	investorGroup_tx: string;
	tickerSymbol_tx: string;
	description_tx: string;
	investorType_tx: string;
	exchangeName_tx: string;
	addresses: ICompanyProfileAddress[];
	bullets: ICompanyProfileBullets[];
}

export interface ICompanyProfileAddress {
	address_tx: string;
	postalCode_tx: string;
	city_tx: string;
	stateProv_tx: string;
	stateProv_cd: string;
	country_tx: string;
	country_cd: string;
	suiteFloor_tx: string;
	primary_fg: boolean;
}

export interface ICompanyProfileBullets {
	bullet_id: number;
	bullet_tx: string;
}

interface IReturnPlayerDetailCompanyInfo {
	Company_tx?: string | null;
	CEO_tx?: string | null;
	Website_tx?: string | null;
	InvestorGroup_tx?: string | null;
	TickerSymbol_tx?: string | null;
	Description_tx?: string | null;
	InvestorType_tx?: string | null;
	ExchangeName_tx?: string | null;
}

interface IReturnPlayerDetailCompanyAddress {
	Company_id?: number | null;
	CompanyAddress_tx?: string | null;
	PostalCode_tx?: string | null;
	City_tx?: string | null;
	StateProv_tx?: string | null;
	StateProv_cd?: string | null;
	Country_tx?: string | null;
	Country_cd?: string | null;
	SuiteFloor_tx?: null;
	Primary_fg?: number | null;
	Create_dt?: string | null;
}

interface IReturnPlayerDetailCompanyBullet {
	Company_id: number;
	Bullet_id: number;
	Bullet_tx: string;
}

type IReturnPlayerDetail_newPTSRecordSets =
	| IReturnPlayerDetailCompanyInfo[]
	| IReturnPlayerDetailCompanyAddress[]
	| IReturnPlayerDetailCompanyBullet[];

class CompanyProfile {
	public static async findByUuid(uuid: string) {
		const { rcaweb } = await dbs.get();
		const result = await rcaweb
			.request()
			.input('Company_id', UniqueIdentifier, uuid)
			.execute<IReturnPlayerDetail_newPTSRecordSets>(
				'ReturnPlayerDetail_newPTS'
			);

		const [infos, addresses, bullets]: [
			IReturnPlayerDetailCompanyInfo[],
			IReturnPlayerDetailCompanyAddress[],
			IReturnPlayerDetailCompanyBullet[]
		] = result.recordsets as any;

		return { infos, addresses, bullets };
	}
}

export default CompanyProfile;
