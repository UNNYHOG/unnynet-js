import DefaultSocial from "./DefaultSocial";

export default class Nutaku extends DefaultSocial {
    constructor(unnyNetBase) {
        super(unnyNetBase);
    }

    authorize(callback) {
        this.API.authWithNutakuGadget(callback);
    }

    getDeviceIdForNakama() {
        return null;
    }
}
