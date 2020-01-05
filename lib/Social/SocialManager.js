import UnnyConstants from "../Constants";
import Nutaku from "./Nutaku";
import Vkontakte from "./Vkontakte";
import Odnoklassniki from "./Odnoklassniki";
import Facebook from "./Facebook";
import DefaultSocial from "./DefaultSocial";

export default class SocialManager {

    static createSocialPlatform(unnyNetBase, platform) {
        switch (platform) {
            case UnnyConstants.Platform.NUTAKU:
                return new Nutaku(unnyNetBase);
            case UnnyConstants.Platform.VKONTAKTE:
                return new Vkontakte(unnyNetBase);
            case UnnyConstants.Platform.ODNOKLASSNIKI:
                return new Odnoklassniki(unnyNetBase);
            case UnnyConstants.Platform.FACEBOOK:
                return new Facebook(unnyNetBase);
            default:
                return new DefaultSocial(unnyNetBase);
        }
    }
}
