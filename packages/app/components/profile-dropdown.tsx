import { Platform, useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuItemNativeIcon,
} from "@showtime-xyz/universal.dropdown-menu";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Copy,
  Flag,
  Slash,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useBlock } from "app/hooks/use-block";
import { useReport } from "app/hooks/use-report";
import { useShare } from "app/hooks/use-share";
import type { Profile } from "app/types";

type Props = {
  user: Profile;
  tw?: string;
};

function ProfileDropdown({ user, tw = "" }: Props) {
  //const { rudder } = useRudder();
  const { report } = useReport();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();
  const share = useShare();
  const { width } = useWindowDimensions();
  const isBlocked = getIsBlocked(user.data.profile._id);
  const isDark = useIsDarkMode();

  // console.log(`PROFILEDROP=${JSON.stringify(user)}`);

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button
          variant="tertiary"
          iconOnly
          size={width < 768 ? "small" : "regular"}
          tw={tw}
        >
          <MoreHorizontal
            width={24}
            height={24}
            color={isDark ? "#FFF" : "#000"}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent loop>
        <DropdownMenuItem
          onSelect={async () => {
            const result = await share({
              url: `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/${
                user?.data.profile.username ?? user?.data.profile.wallet_address
              }`,
            });

            // if (result.action === "sharedAction") {
            //   rudder?.track(
            //     "User Shared",
            //     result.activityType ? { type: result.activityType } : undefined
            //   );
            // }
          }}
          key="share"
        >
          <MenuItemIcon Icon={Copy} />
          <DropdownMenuItemNativeIcon iosIconName="square.and.arrow.up" />
          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            Share
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          key="block"
          className="danger"
          onSelect={() => {
            toggleBlock({
              isBlocked,
              creatorId: user?.data.profile._id,
              name: user?.data.profile.name,
            });
          }}
        >
          <MenuItemIcon Icon={Slash} />
          <DropdownMenuItemNativeIcon
            iosIconName={isBlocked ? "circle" : "circle.slash"}
          />

          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            {isBlocked ? "Unblock User" : "Block User"}
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={async () => {
            router.push(
              {
                pathname: Platform.OS === "web" ? router.pathname : "/report",
                query: {
                  ...router.query,
                  reportModal: true,
                  userId: user.data.profile._id,
                },
              },
              Platform.OS === "web" ? router.asPath : undefined
            );
          }}
          key="report"
        >
          <MenuItemIcon Icon={Flag} />
          <DropdownMenuItemNativeIcon iosIconName="flag" />
          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            Report
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { ProfileDropdown };
