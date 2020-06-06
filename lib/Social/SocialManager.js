import UnnyConstants from "../Constants";
import Nutaku from "./Nutaku";
import Vkontakte from "./Vkontakte";
import Odnoklassniki from "./Odnoklassniki";
import Facebook from "./Facebook";
import DefaultSocial from "./DefaultSocial";
import FacebookInstant from "./FacebookInstant";

export default class SocialManager {

    static createSocialPlatform(unnyNetBase, platform) {
        switch (platform) {
            case UnnyConstants.Platform.NUTAKU_PC_BROWSER:
                return new Nutaku(unnyNetBase);
            case UnnyConstants.Platform.VKONTAKTE:
                return new Vkontakte(unnyNetBase);
            case UnnyConstants.Platform.ODNOKLASSNIKI:
                return new Odnoklassniki(unnyNetBase);
            case UnnyConstants.Platform.FACEBOOK:
                return new Facebook(unnyNetBase);
            case UnnyConstants.Platform.FB_INSTANT:
                return new FacebookInstant(unnyNetBase);
            default:
                return new DefaultSocial(unnyNetBase);
        }
    }
}
