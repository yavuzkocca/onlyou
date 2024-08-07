import { useCallback, useMemo } from "react";

import { useMyInfo } from "app/hooks/api-hooks";
import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query-notif";
import { useUser } from "app/hooks/use-user";

export interface Actor {
  img_url: string;
  name: string;
  profile_id: number;
  username: string;
  wallet_address: string;
}

export interface NotificationNFT {
  id: number;
  token_identifier: string;
  display_name: string;
  chain_identifier: string;
  contract_address: string;
  creator: Actor;
}
export interface NotificationType {
  id: number;
  to_timestamp: string;
  img_url: string;
  description?: string;
  type_name: string;
  actors: Actor[];
  nfts: NotificationNFT[];
}

export const useNotifications = () => {
  const PAGE_SIZE = 15;
  const { isAuthenticated, user } = useUser();
  const { data: myInfoData } = useMyInfo();

  console.log(`MYINFDATWALADD= ${JSON.stringify(user)}`);

  const notificationsFetcher = useCallback(
    (index: number, previousPageData: []) => {
      if (
        typeof index !== "number" &&
        previousPageData &&
        !previousPageData.length
      )
        return null;

      const url = isAuthenticated
        ? `/api/users/v1/notifications?page=${index + 1}&limit=${PAGE_SIZE}`
        : null;

      return {
        url,
      };
    },

    [isAuthenticated]
  );

  const queryState = useInfiniteListQuerySWR<NotificationType>(
    notificationsFetcher,
    {
      pageSize: PAGE_SIZE,
    }
  );
  console.log(`Querrry= ${JSON.stringify(queryState)}`);

  const newData = useMemo(() => {
    let newData: NotificationType[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  console.log(`NEWDATA ${JSON.stringify(newData)}`);

  const hasUnreadNotification = useMemo(() => {
    if (
      newData &&
      newData[0] &&
      myInfoData &&
      myInfoData.data &&
      myInfoData.data.data &&
      (myInfoData.data.data.notifications_last_opened === null ||
        Number(newData[0].to_timestamp) >
          Number(myInfoData.data.data.notifications_last_opened))
    ) {
      return true;
    }

    return false;
  }, [newData, myInfoData]);

  return { ...queryState, data: newData, hasUnreadNotification };
};
