import { Request } from '@hapi/hapi';
import CompanyProfile from '../models/company-profile';

class CompanyBulletsController {
	public static async get(request: Request) {
		const { bullets } = await CompanyProfile.findByUuid(request.params.id);
		return bullets.map(v => ({
			bullet_id: v.Bullet_id,
			bullet_tx: v.Bullet_tx,
		}));
	}
}

export default CompanyBulletsController;
