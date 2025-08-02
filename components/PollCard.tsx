import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '../app/(tabs)/styles';

interface Poll {
  _id: string;
  userId: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  createdAt: string;
  hide: boolean;
  shortId: number;
  img?: string;
  totalVotes: number;
  username: string;
}

interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  return (
    <View style={styles.pollCard}>
      {poll.img && <Image source={{ uri: poll.img }} style={styles.pollImage} />}

      <View style={styles.pollContent}>
        <Text style={styles.user}>{poll.username}</Text>
        <Text style={styles.question}>{poll.text}</Text>

        {poll.totalVotes > 0 && (
          <>
            {poll.options.map((option) => {
              const percent =
                poll.totalVotes > 0
                  ? Math.round((option.votes / poll.totalVotes) * 100)
                  : 0;

              return (
                <View key={option.id} style={styles.optionContainer}>
                  <View style={styles.optionLabelRow}>
                    <Text style={styles.optionLabel}>{option.text}</Text>
                    <Text style={styles.optionPercent}>
                      {percent}% ({option.votes})
                    </Text>
                  </View>
                  <View style={styles.optionBarBackground}>
                    <View
                      style={[styles.optionBarFill, { width: `${percent}%` }]}
                    />
                  </View>
                </View>
              );
            })}

            <Text style={styles.totalAnswers}>
              Total votes: {poll.totalVotes}
            </Text>
          </>
        )}

        <View style={styles.actionsWithMargin}>
          <TouchableOpacity>
            <Feather name="message-circle" size={18} color="#121212" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="refresh-cw" size={18} color="#121212" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="share-2" size={18} color="#121212" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PollCard; 