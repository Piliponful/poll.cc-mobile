import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
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

const fetchPolls = async (): Promise<Message[]> => {
  try {
    const response = await fetch("https://poll.cc/", {
      method: "POST",
      body: JSON.stringify({
        method: "getMessages",
        params: {
          offset: 0,
          sort: "Most Answered",
          filter: "All Time"
        }
      })
    });
    const data = await response.json();
    return data.messages.filter((message: Message) => !message.parentMessageId); // Only keep polls
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
          </View>
          <Text style={styles.stats}>{100 - poll.noPercentage}% Yes · {poll.noPercentage}% No</Text>
          <Text style={styles.totalAnswers}>{poll.totalAnswers} votes</Text>
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-circle" size={18} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="refresh-cw" size={18} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={18} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const PollScreen: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [polls, setPolls] = useState<Message[]>([]);

  useEffect(() => {
    fetchPolls().then(data => setPolls(data));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>All Time Most Answered</Text>
      
      <FlatList
        data={polls}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PollCard poll={item} />}
      />
      
      <View style={styles.askBox}>
        <TextInput
          style={styles.input}
          placeholder="Ask something..."
          value={question}
          onChangeText={setQuestion}
        />
        <TouchableOpacity style={styles.askButton}>
          <Text style={styles.askText}>Post</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity><AntDesign name="home" size={22} color="gray" /></TouchableOpacity>
        <TouchableOpacity><AntDesign name="message1" size={22} color="gray" /></TouchableOpacity>
        <TouchableOpacity><AntDesign name="user" size={22} color="gray" /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PollScreen;
