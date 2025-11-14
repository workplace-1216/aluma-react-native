import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, Platform, Share} from 'react-native';
import {SvgBack} from '../../../../assets/svg';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';
import {useAppDispatch, useAppSelector} from '../../../../redux/store';
import {saveFrequency} from '../../../../service/frequency/UserFrequencies/saveFrequency';
import {setSavedFrequencies} from '../../../../redux/slice/savedFrequenciesSlice';
import {FREQUENCY} from '../../../../redux/slice/moodSlice';
import showToast from '../../../UI/CustomToast/CustomToast';

type Props = {
  frequencyInfo: FREQUENCY;
  onBack: () => void;
};

const FrequencyInfo: React.FC<Props> = ({frequencyInfo, onBack}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const savedFrequencies = useAppSelector(
    state => state.savedFrequencies.savedFrequencies,
  );

  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  // keep local state in sync with redux
  useEffect(() => {
    const already = savedFrequencies?.some(f => f._id === frequencyInfo._id);
    setIsAlreadySaved(already);
  }, [savedFrequencies, frequencyInfo._id]);

  const handleSave = async () => {
    if (isAlreadySaved) {return;}

    try {
      await saveFrequency(frequencyInfo._id, user._id);
      dispatch(setSavedFrequencies([...savedFrequencies, frequencyInfo]));
      showToast('Frequency saved successfully!');
    } catch (error) {
      console.error('Failed to save frequency:', error);
    }
  };
const handleShare = async () => {
  try {
    const subject = `${frequencyInfo.frequency_value}Hz - ${frequencyInfo.title}`;

    // Texto curto para a maioria dos apps
    const intro = `I'm enjoying this frequency: ${subject}`;
    const details = frequencyInfo.detailed_information?.trim() ?? '';
    const snippet =
      details.length > 180 ? details.slice(0, 177).trimEnd() + '…' : details;

    // Se você tiver um link próprio para compartilhar, coloque aqui.
    // Caso não tenha, uso a imagem como URL (iOS anexa melhor; Android inclui no texto).
    const shareUrl =
      (frequencyInfo as any).share_url || frequencyInfo.background_image || '';

    // Android ignora 'url' em alguns apps, então concateno no message.
    const message =
      Platform.OS === 'android'
        ? [intro, snippet, shareUrl].filter(Boolean).join('\n\n')
        : [intro, snippet].filter(Boolean).join('\n\n');

    const result = await Share.share(
      {
        title: subject,
        message,
        // iOS usa 'url' como anexo/link no share sheet
        url: Platform.OS === 'ios' && shareUrl ? shareUrl : undefined,
      },
      // 'subject' aparece em apps de e-mail
      {subject}
    );

    // (Opcional) feedback
    // if (result.action === Share.sharedAction) { ... }
  } catch (e) {
    console.error('Share failed:', e);
  }
};
  return (
    <>
      <View style={styles.backBtn}>
        <TouchableOpacity onPress={onBack}>
          <SvgBack height={heightToDP('3.004%')} width={widthToDP('6.744%')} />
        </TouchableOpacity>
      </View>

      <View style={styles.frequencyInfoWrapper}>
        <Text style={styles.frequencyInfoTitle}>
          {frequencyInfo.frequency_value}Hz - {frequencyInfo.title}
        </Text>

        <Image
          source={{uri: frequencyInfo.background_image}}
          style={styles.moodImage}
        />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.frequencyInfoDescription}>
            {frequencyInfo.detailed_information}
          </Text>
        </ScrollView>

        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isAlreadySaved && styles.actionButtonDisabled,
            ]}
            disabled={isAlreadySaved}
            onPress={handleSave}>
            <Text style={styles.actionButtonText}>
              {isAlreadySaved ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default FrequencyInfo;
