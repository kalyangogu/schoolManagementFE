import React from 'react';
import { View } from 'react-native';
import { Select, TextField } from '../../components/ui';
import { SECURITY_QUESTIONS, SECURITY_QUESTION_COUNT } from '../../config/securityQuestions';

// Choose 3 of the 6 questions and type an answer for each.
// value = [{ key, answer }] (length 3). Used when setting questions AND when recovering a password.
export const emptyPicks = () => Array.from({ length: SECURITY_QUESTION_COUNT }, () => ({ key: null, answer: '' }));
export const picksError = (picks) => {
  if (picks.some((p) => !p.key)) return `Choose ${SECURITY_QUESTION_COUNT} different questions`;
  if (picks.some((p) => !p.answer.trim())) return 'Please answer every question';
  return '';
};
export const toAnswers = (picks) => picks.map((p) => ({ key: p.key, answer: p.answer }));

export default function QuestionPicker({ value, onChange }) {
  const patch = (i, p) => onChange(value.map((x, j) => (j === i ? { ...x, ...p } : x)));
  return (
    <View style={{ gap: 12 }}>
      {value.map((p, i) => {
        const taken = value.filter((_, j) => j !== i).map((x) => x.key);
        const options = SECURITY_QUESTIONS.filter((q) => !taken.includes(q.key)).map((q) => ({ label: q.text, value: q.key }));
        const q = SECURITY_QUESTIONS.find((x) => x.key === p.key);
        return (
          <View key={i} style={{ gap: 8 }}>
            <Select label={`Question ${i + 1}`} value={p.key} options={options} onChange={(k) => patch(i, { key: k })} placeholder="Choose a question" />
            <TextField placeholder={(q && q.hint) || 'Your answer'} autoCapitalize="none" autoCorrect={false} value={p.answer} onChangeText={(v) => patch(i, { answer: v })} />
          </View>
        );
      })}
    </View>
  );
}
