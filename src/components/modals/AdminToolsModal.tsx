import React from 'react';
import { useState } from 'react';
import { always, cond, equals } from 'ramda';

import { css } from 'stitches.config';

import { ModalKey } from 'types/modal';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import ModalContainer from 'components/modals/common/ModalContainer';
import ModalTabs from 'components/modals/common/ModalTabBar';
import ModalContent from 'components/modals/common/ModalContent';
import RemoveUsernamePane from 'components/modals/admin-tools/RemoveUsernamePane';
import RemoveCreatorAccessPane from 'components/modals/admin-tools/RemoveCreatorAccessPane';
import RemoveInvitesPane from 'components/modals/admin-tools/RemoveInvitesPane';
import ApproveMigrationPane from './admin-tools/ApproveMigrationPane';

interface AdminToolsModalProps {
  publicKey: string;
}

enum AdminModalTab {
  RemoveUsername = 'Username',
  RemoveCreatorAccess = 'Creator Access',
  RemoveInvites = 'Invites',
  ApproveMigration = 'Creator Migration',
}

const modalStyles = css({
  maxWidth: '580px !important',
  padding: '0px !important',
})();

export default function AdminToolsModal(
  props: AdminToolsModalProps
): JSX.Element {
  const { publicKey } = props;

  const [modalTab, setModalTab] = useState(AdminModalTab.RemoveUsername);

  const { data: userData } = useUserByPublicKey({ publicKey });

  return (
    <ModalContainer modalKey={ModalKey.ADMIN_TOOLS}>
      <ModalContent className={modalStyles}>
        <ModalTabs
          tabs={[
            {
              onClick: () => setModalTab(AdminModalTab.RemoveUsername),
              isActive: modalTab === AdminModalTab.RemoveUsername,
              children: AdminModalTab.RemoveUsername,
            },
            {
              onClick: () => setModalTab(AdminModalTab.RemoveCreatorAccess),
              isActive: modalTab === AdminModalTab.RemoveCreatorAccess,
              children: AdminModalTab.RemoveCreatorAccess,
            },
            {
              onClick: () => setModalTab(AdminModalTab.RemoveInvites),
              isActive: modalTab === AdminModalTab.RemoveInvites,
              children: AdminModalTab.RemoveInvites,
            },
            {
              onClick: () => setModalTab(AdminModalTab.ApproveMigration),
              isActive: modalTab === AdminModalTab.ApproveMigration,
              children: AdminModalTab.ApproveMigration,
            },
          ]}
        />

        {cond([
          [
            equals(AdminModalTab.RemoveUsername),
            always(<RemoveUsernamePane user={userData?.user} />),
          ],
          [
            equals(AdminModalTab.RemoveCreatorAccess),
            always(<RemoveCreatorAccessPane user={userData?.user} />),
          ],
          [
            equals(AdminModalTab.RemoveInvites),
            always(<RemoveInvitesPane user={userData?.user} />),
          ],
          [
            equals(AdminModalTab.ApproveMigration),
            always(<ApproveMigrationPane user={userData?.user} />),
          ],
        ])(modalTab)}
      </ModalContent>
    </ModalContainer>
  );
}
