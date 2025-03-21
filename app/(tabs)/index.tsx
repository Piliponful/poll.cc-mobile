import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';

interface Message {
  _id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: number;
  totalAnswers: number;
  answersCount: { yes: number; no: number };
  noPercentage: number;
  parentMessageId: string;
  img?: string;
}

const fetchPolls = async (offset: number): Promise<Message[]> => {
  try {
    const response = await fetch("https://poll.cc/", {
      method: "POST",
      body: JSON.stringify({
        method: "getMessages",
        params: {
          offset,
          sort: "Most Answered",
          filter: "All Time"
        }
      })
    });
    const data = await response.json();
    return data.messages.filter((message: Message) => !message.parentMessageId);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
};

const PollCard: React.FC<{ poll: Message }> = ({ poll }) => (
  <View style={styles.pollCard}>
    {poll.img && <Image source={{ uri: poll.img }} style={styles.pollImage} />}
    <View style={styles.pollContent}>
      <Text style={styles.user}>{poll.username}</Text>
      <Text style={styles.question}>{poll.content}</Text>
      {poll.totalAnswers > 0 && (
        <View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${100 - poll.noPercentage}%` }]} />
            <View style={[styles.progressBarNo, { width: `${poll.noPercentage}%` }]} />
          </View>
          <Text style={styles.stats}>{100 - poll.noPercentage}% Yes · {poll.noPercentage}% No</Text>
          <Text style={styles.totalAnswers}>{poll.totalAnswers} votes</Text>
        </View>
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

const PollScreen: React.FC = () => {
  const [polls, setPolls] = useState<Message[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchPolls(0).then(data => setPolls(data));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>All Time Most Answered</Text>
      
      <FlatList
        data={polls}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PollCard poll={item} />}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity><AntDesign name="home" size={22} color="#121212" /></TouchableOpacity>
        <TouchableOpacity style={styles.addButtonContainer}>
          <AntDesign name="plus" size={22} color="white" style={styles.addButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
          <AntDesign name="user" size={22} color="#121212" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PollScreen;
