import { AddedByUser } from '../user/user';
import { AppError } from '../spot4zik-error/app-error';
import { Zikresource } from './zikresource';
import { ZikresourceDAO } from './zikresource-dao';

export class ZikresourceBLO {

    zikResourceDAO: ZikresourceDAO;

    constructor() {
        this.zikResourceDAO = new ZikresourceDAO();
    }

    async createZikresource(data: any): Promise<Zikresource> {
        // Prerequisites:
        this.checkIfDataAreValid(data);
        // Save the zikresource on database
        let zikResource = await this.zikResourceDAO.save(this.buildZikresourceInstance(data));
        return zikResource;
    }

    async getZikresources(): Promise<Zikresource[]> {
        let result = await this.zikResourceDAO.retrieveAll();
        if (!result) {
            result = [];
        }
        return result;
    }

    async getZikresourcesOfUser(email: string): Promise<Zikresource[]> {
        let result = await this.zikResourceDAO.retrieveByEmail(email);
        if (!result) {
            result = [];
        }
        return result;
    }

    async getOneZikresourceById(id: string): Promise<Zikresource | null> {
        let result = await this.zikResourceDAO.retrieveOneById(id);
        if (!result) {
            result = null;
        }
        return result;
    }

    async deleteOneZikresource(id: string, userWhoWantsTheDeletion: any): Promise<void> {
        let zikresource = await this.getOneZikresourceById(id);
        if (zikresource == null) {
            throw new AppError("404-1");
        }
        let isCreatedBySameUser = userWhoWantsTheDeletion.addedBy != null 
            && userWhoWantsTheDeletion.addedBy.email != null
            && await this.hasSameOwner(id, userWhoWantsTheDeletion.addedBy?.email);
        if (!isCreatedBySameUser) {
            throw new AppError("400-5");
        }
        let deleted = await this.zikResourceDAO.delete(zikresource);
        if (!deleted) {
            throw new AppError("500-4");
        }
    }

    async updateOneZikresource(id: string, data: any): Promise<Zikresource | undefined> {
        let zikresource = await this.getOneZikresourceById(id);
        if (zikresource == null) {
            throw new AppError("404-1");
        }
        this.checkIfDataAreValid(data);
        let isCreatedBySameUser = data.addedBy != null 
            && data.addedBy.email != null && await this.hasSameOwner(id, data.addedBy?.email);
        if (!isCreatedBySameUser) {
            throw new AppError("400-5");
        }
        // if prerequisites are ok, we don't have exception, so we do it:
        let zikResourceUpdated = await this.zikResourceDAO.updateOne(id, this.buildZikresourceInstance(data));
        return zikResourceUpdated;
    }

    private checkIfDataAreValid(data: any): void {
        // 1. must have at least an url and a title
        if (data == null || data.url == null || data.title == null) {
            throw new AppError("400-1");
        }
        // 2. not more than 10 tags
        if (data.tags && data.tags.length > 10) {
            throw new AppError("400-2");
        }
    }

    private buildZikresourceInstance(data: any): Zikresource {
        let zikresource = new Zikresource(data.url, data.title);
        if (data.type) { zikresource.type = data.type; }
        if (data.artist) { zikresource.artist = data.artist; }
        if (data.tags) { zikresource.tags = data.tags; }
        if (data._id && data.email) {
            zikresource.addedBy =  new AddedByUser(data._id, data.email, data.displayName);
        }
        return zikresource;
    }

    private async hasSameOwner(zikResourceId: string, userEmail: string): Promise<boolean> {
        const zikResource = await this.getOneZikresourceById(zikResourceId);
        return (zikResource != null && zikResource.addedBy?.email === userEmail);
    }

}