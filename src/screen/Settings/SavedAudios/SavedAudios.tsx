import React, {useMemo, useCallback} from 'react';
import {FlatList, Linking, Text, TouchableOpacity, View} from 'react-native';
import Container from '../../../components/layout/Container';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {goBack} from '../../../navigation/AppNavigator';
import {styles} from './styles';
import {useAppSelector} from '../../../redux/store';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {SvgHeadphones, SvgPlay} from '../../../assets/svg';

type SavedAudioItem = {
  id: string;
  title: string;
  description?: string;
  frequencyValue?: number;
  audioUrl?: string;
};

const formatFrequencyValue = (value?: number) =>
  typeof value === 'number' ? `${value} Hz` : undefined;

const SavedAudios: React.FC = () => {
  const savedFrequencies = useAppSelector(
    state => state.savedFrequencies.savedFrequencies,
  );

  const savedAudios = useMemo<SavedAudioItem[]>(() => {
    return savedFrequencies.map(frequency => ({
      id: frequency._id,
      title: frequency.title,
      description: frequency.description,
      frequencyValue: frequency.frequency_value,
      audioUrl: frequency.default_audio_file,
    }));
  }, [savedFrequencies]);

  const handlePlayAudio = useCallback(async (url?: string) => {
    if (!url) {
      showToast('Áudio indisponível para esta frequência.', 'info');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showToast('Não foi possível reproduzir este áudio.', 'error');
      }
    } catch (error) {
      console.error('Failed to open saved audio:', error);
      showToast('Erro ao tentar reproduzir o áudio.', 'error');
    }
  }, []);

  const renderItem = useCallback(
    ({item}: {item: SavedAudioItem}) => {
      const frequencyValue = formatFrequencyValue(item.frequencyValue);
      const disabled = !item.audioUrl;

      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              {!!frequencyValue && (
                <Text style={styles.frequencyValue}>{frequencyValue}</Text>
              )}
            </View>
            <SvgHeadphones width={34} height={34} />
          </View>

          {!!item.description && (
            <Text numberOfLines={3} style={styles.description}>
              {item.description}
            </Text>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.playButton,
                disabled && {opacity: 0.4},
              ]}
              disabled={disabled}
              onPress={() => handlePlayAudio(item.audioUrl)}>
              <SvgPlay width={22} height={22} />
              <Text style={styles.playButtonText}>Ouvir agora</Text>
            </TouchableOpacity>
            <Text style={styles.metaText}>
              {disabled
                ? 'Sem áudio disponível'
                : 'Áudio principal salvo'}
            </Text>
          </View>
        </View>
      );
    },
    [handlePlayAudio],
  );

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Nenhum áudio salvo ainda</Text>
      <Text style={styles.emptyDescription}>
        Salve frequências para acessar aqui os áudios principais e ouvir quando
        quiser.
      </Text>
    </View>
  );

  const contentContainerStyle = savedAudios.length
    ? styles.listContent
    : styles.emptyContent;

  return (
    <Container>
      <HeaderWithBack title="Saved Audios" onBack={goBack} />
      <FlatList
        data={savedAudios}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={emptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default SavedAudios;
