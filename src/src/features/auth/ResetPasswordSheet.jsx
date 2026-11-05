import React, { useEffect, useState } from 'react';
import { BottomSheet, TextField, Button, Banner } from '../../components/ui';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { PASSWORD_MIN } from '../../utils/format';

// Admin tool: set a new password for any user (e.g. a student who forgot their security answers).
// target = { name, userId?, loginId?, isStudent? }  (the backend accepts userId OR loginId)
export default function ResetPasswordSheet({ target, onClose }) {
  const [pw, setPw] = useState('');
  const [reset, saving] = useAction(api.auth.adminResetPassword, 'Password changed');
  useEffect(() => { setPw(''); }, [target]);

  const submit = async () => {
    const { ok } = await reset({ userId: target.userId, loginId: target.loginId, newPassword: pw });
    if (ok) onClose();
  };

  return (
    <BottomSheet visible={!!target} onClose={onClose} title={target ? `Reset password for ${target.name}` : ''}>
      {target ? (
        <>
          <Banner tone="warning" text={`They can log in with this password straight away. Their security questions are cleared too${target.isStudent ? ', so ask them to set new ones after logging in' : ''}.`} style={{ marginBottom: 12 }} />
          <TextField label="New password" icon="lock-outline" secureTextEntry autoCapitalize="none" placeholder={`At least ${PASSWORD_MIN} characters`} value={pw} onChangeText={setPw} style={{ marginBottom: 12 }} />
          <Button title="Reset password" icon="lock-reset" loading={saving} disabled={pw.length < PASSWORD_MIN} onPress={submit} />
        </>
      ) : null}
    </BottomSheet>
  );
}
