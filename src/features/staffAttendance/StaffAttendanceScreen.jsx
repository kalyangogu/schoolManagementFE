import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Screen, Card, Select, StatTile, Button, TextField, BottomSheet, Icon, EmptyState, Banner } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { prettyDate } from '../../utils/format';

const STATUS = {
  PRESENT: { label: 'PRESENT', tone: 'success' },
  ABSENT: { label: 'ABSENT', tone: 'danger' },
  LATE: { label: 'LATE', tone: 'warning' },
  HALF_DAY: { label: 'HALF DAY', tone: 'purple' },
  LEAVE: { label: 'LEAVE', tone: 'neutral' },
  HOLIDAY: { label: 'HOLIDAY', tone: 'info' },
  UPCOMING: { label: 'UPCOMING', tone: 'neutral' },
};
const FIX_OPTIONS = [['PRESENT', 'Present'], ['LATE', 'Late'], ['HALF_DAY', 'Half day'], ['ABSENT', 'Absent'], ['LEAVE', 'Leave'], ['HOLIDAY', 'Holiday']].map(([value, label]) => ({ label, value }));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StaffAttendanceScreen({ navigation }) {
  const t = useTheme();
  const now = new Date();
  const [teacherId, setTeacherId] = useState(null);
  const [ym, setYm] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [open, setOpen] = useState(null);
  const [fix, setFix] = useState(null); // { date, status, reason }

  const teachers = useAsync(() => api.staff.list({ role: 'TEACHER' }));
  const month = useAsync(() => (teacherId ? api.staffAttendance.month({ teacherId, ...ym }) : Promise.resolve(null)), [teacherId, ym.year, ym.month]);
  const [correct, saving] = useAction(api.staffAttendance.correct, 'Correction saved');

  useEffect(() => { if (!teacherId && teachers.data && teachers.data.length) setTeacherId(teachers.data[0].id); }, [teachers.data]);

  const shift = (n) => {
    setOpen(null);
    setYm(({ year, month: m }) => {
      const d = new Date(year, m - 1 + n, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    });
  };

  const saveFix = async () => {
    const { ok } = await correct({ teacherId, date: fix.date, status: fix.status, reason: fix.reason });
    if (ok) { setFix(null); month.reload(); }
  };

  const sum = month.data && month.data.summary;
  const days = (month.data && month.data.days) || [];
  const toneColor = { success: t.colors.success, danger: t.colors.danger, warning: t.colors.warning, purple: t.colors.purple, info: t.colors.info, neutral: t.colors.textMuted };

  return (
    <Screen title="Staff attendance" subtitle="Teacher calendar, entry and exit records" onBack={navigation.goBack} onRefresh={month.reload} refreshing={month.loading && !!month.data}>
      <Card>
        <Select label="Teacher" value={teacherId} options={(teachers.data || []).map((x) => ({ label: x.name, value: x.id }))} onChange={setTeacherId} placeholder="Choose a teacher" />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => shift(-1)} hitSlop={10} style={{ padding: 6 }} accessibilityLabel="Previous month"><Icon name="chevron-back" size={24} color={t.colors.primary} /></Pressable>
          <Text style={{ fontSize: t.fontSize.lg, fontWeight: '700', color: t.colors.text }}>{MONTHS[ym.month - 1]} {ym.year}</Text>
          <Pressable onPress={() => shift(1)} hitSlop={10} style={{ padding: 6 }} accessibilityLabel="Next month"><Icon name="chevron-forward" size={24} color={t.colors.primary} /></Pressable>
        </View>
      </Card>

      {!teacherId ? <Banner text="Choose a teacher to view attendance." /> : !sum ? <EmptyState loading /> : (
        <>
          <Card title="Month summary" subtitle="Attendance across working days" right={<Text style={{ fontSize: t.fontSize.xl, fontWeight: '800', color: t.colors.primary }}>{sum.percent}%</Text>}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <StatTile label="Present" value={String(sum.present)} tone="success" />
              <StatTile label="Absent" value={String(sum.absent)} tone="danger" />
              <StatTile label="Holidays" value={String(sum.holidays)} tone="info" />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <StatTile label="Late" value={String(sum.late)} tone="warning" />
              <StatTile label="Half day" value={String(sum.halfDay)} tone="purple" />
              <StatTile label="Leave" value={String(sum.leave)} tone="neutral" />
            </View>
            <Text style={{ color: t.colors.textMuted, fontSize: t.fontSize.sm }}>{sum.workingDays} working days | {sum.holidays} holidays | {sum.calendarDays} calendar days</Text>
          </Card>

          {days.map((d) => {
            const st = STATUS[d.status];
            const isOpen = open === d.date;
            const title = new Date(`${d.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
            return (
              <Pressable key={d.date} onPress={() => setOpen(isOpen ? null : d.date)} style={{ backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderWidth: 1, borderColor: t.colors.border, padding: t.spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: t.colors.text, fontSize: t.fontSize.md }}>{title}</Text>
                    <Text style={{ fontWeight: '800', fontSize: t.fontSize.xs + 1, color: toneColor[st.tone], marginTop: 2 }}>
                      {st.label}{d.status === 'HOLIDAY' && d.note ? ` | ${d.note}` : ''}{d.corrected ? '  ·  corrected' : ''}
                    </Text>
                  </View>
                  <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={t.colors.textMuted} />
                </View>
                {isOpen ? (
                  <View style={{ marginTop: 10, gap: 10 }}>
                    {d.inTime ? (
                      <View style={{ flexDirection: 'row', gap: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="clock-in" size={18} color={t.colors.success} /><Text style={{ color: t.colors.text }}>In {d.inTime}</Text></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="clock-out" size={18} color={t.colors.danger} /><Text style={{ color: t.colors.text }}>Out {d.outTime}</Text></View>
                      </View>
                    ) : null}
                    {d.note && d.status !== 'HOLIDAY' ? <Text style={{ color: t.colors.textMuted }}>{d.note}</Text> : null}
                    {d.status === 'UPCOMING'
                      ? <Text style={{ color: t.colors.textMuted }}>This day has not happened yet.</Text>
                      : <Button small variant="outline" icon="calendar-edit" title="Correct this day" onPress={() => setFix({ date: d.date, status: d.status, reason: '' })} />}
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </>
      )}

      <BottomSheet visible={!!fix} onClose={() => setFix(null)} title={fix ? `Correct ${fix.date}` : ''} subtitle={fix ? prettyDate(fix.date) : ''}>
        {fix ? (
          <View style={{ gap: 12, paddingBottom: 8 }}>
            <Select label="Attendance" value={fix.status} options={FIX_OPTIONS} onChange={(v) => setFix({ ...fix, status: v })} />
            <TextField label="Reason for correction" required placeholder="Why is this being changed?" value={fix.reason} onChangeText={(v) => setFix({ ...fix, reason: v })} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button style={{ flex: 1 }} variant="outline" title="Cancel" onPress={() => setFix(null)} />
              <Button style={{ flex: 1 }} title="Save correction" loading={saving} onPress={saveFix} />
            </View>
          </View>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}
