// src/features/mood/screens/Mood.tsx
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  PixelRatio,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {SvgHeadphones, SvgRightChev} from '../../../assets/svg';
import images from '../../../assets/images';
import {goBack, reset} from '../../../navigation/AppNavigator';
import {RouteProp, useRoute} from '@react-navigation/native';
import {FREQUENCY, MOOD} from '../../../redux/slice/moodSlice';
import {useAppDispatch} from '../../../redux/store';
import {
  addToFrequencyQueue,
  clearFrequencyQueue,
  resetCurrentIndex,
  startAllInOneSession,
} from '../../../redux/slice/frequencyQueueSlice';
import routes from '../../../constants/routes';
import CountDownPickerModal from '../../../components/Modals/CountDownPickerModal';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import BackgroundWrapper from '../../../components/UI/BackgroundWrapper';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import {audioController} from '../../../services/audio/AudioController'; // FIX: needed to pause current audio before all-in-one

// ───────────────────────────────────────────────────────────────────────────────
// DottedCircle (otimizado)
// - Memoiza a malha de pontos (cálculo O(n²)) com useMemo
// - Evita rerender desnecessário com React.memo
// ───────────────────────────────────────────────────────────────────────────────
type DottedCircleProps = {
  size: number;
  strokeColor?: string;
  strokeWidth?: number;
  dotColor?: string;
  dotRadius?: number;
  spacing?: number;
  margin?: number;
  style?: StyleProp<ViewStyle>;
};

const CIRCLE_SIZE = Dimensions.get('window').width / 1.5;

// separa gerador de pontos para poder memoizar
function generateDots(
  size: number,
  strokeWidth: number,
  dotRadius: number,
  spacing: number,
  margin: number
) {
  const r = size / 2;
  const safeR = r - strokeWidth / 2;
  const maxDist = (safeR - dotRadius) * (safeR - dotRadius);

  const dots: Array<{ x: number; y: number }> = [];
  for (let y = margin; y <= size - margin; y += spacing) {
    for (let x = margin; x <= size - margin; x += spacing) {
      const dx = x - r;
      const dy = y - r;
      if (dx * dx + dy * dy <= maxDist) {
        dots.push({ x, y });
      }
    }
  }
  return dots;
}

const DottedCircle: React.FC<DottedCircleProps> = React.memo(
  ({
    size,

    strokeWidth = 3,
    dotColor = '#FFFFFF',
    dotRadius = 2,
    spacing,
    margin,
    style,
  }) => {
    const s = spacing ?? size / 12;   // densidade de pontos
    const m = margin ?? size * 0.08;  // margem interna
    const r = size / 2;
    const safeR = r - strokeWidth / 2;

    const dots = useMemo(
      () => generateDots(size, strokeWidth, dotRadius, s, m),
      [size, strokeWidth, dotRadius, s, m]
    );

    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg width={size} height={size}>
          <SvgCircle
            cx={r}
            cy={r}
            r={safeR}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {dots.map((p, i) => (
            <SvgCircle key={i} cx={p.x} cy={p.y} r={dotRadius} fill={dotColor} />
          ))}
        </Svg>
      </View>
    );
  }
);

// ───────────────────────────────────────────────────────────────────────────────

type MoodScreenParams = {
  Mood: {
    data: MOOD;
  };
};

const ITEM_HEIGHT = 92; // ajuste conforme seu layout (melhora getItemLayout)

const Mood: React.FC = () => {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<MoodScreenParams, 'Mood'>>();
  const mood = route.params?.data;

  const [countdownPickerVisible, setCountdownPickerVisible] = useState(false);

  // evitar logs soltos em produção
  if (__DEV__) {
    const dpi = PixelRatio.getFontScale();
    // console.log('fontScale', dpi);
    // console.log('frequencies', mood?.frequencies?.length);
  }

  const handleBack = useCallback(() => {
    goBack();
  }, []);

  const handlePlay = useCallback(
    (item: FREQUENCY) => {
      dispatch(clearFrequencyQueue());
      dispatch(resetCurrentIndex());
      dispatch(addToFrequencyQueue(item));
      reset(routes.HOME);
    },
    [dispatch]
  );

  const handleAllInOneListening = useCallback(
    (minutes: number, seconds: number) => {
      const list = mood?.frequencies ?? [];
      if (list.length === 0) {
        return;
      }
      const durationPerFrequency = minutes * 60 + seconds;
      audioController.pauseAll(); // FIX: ensure any active player stops before starting all-in-one
      dispatch(clearFrequencyQueue()); // FIX: reset queue so all-in-one starts from a clean state
      dispatch(resetCurrentIndex()); // FIX: guarantee new session begins at the first frequency
      dispatch(
        startAllInOneSession({
          frequencies: list,
          durationPerFrequency,
        })
      );
      reset(routes.HOME);
    },
    [dispatch, mood?.frequencies]
  );

  // memoiza background de fallback do mood para não re-renderizar o item
  const moodBg = useMemo(() => mood?.background_image || null, [mood?.background_image]);
  const moodIconSource = useMemo(() => {
    if (mood?.icon_url) {
      return {uri: mood.icon_url};
    }
    return images.mood_placeholder;
  }, [mood?.icon_url]);

  // renderItem estável, sem criar objetos toda hora
  const renderItem = useCallback<ListRenderItem<FREQUENCY>>(
    ({item}) => {
      const bgUri =
        (item as any)?.background_image ||
        (item as any)?.image_url ||
        (item as any)?.imageUrl ||
        (item as any)?.photo_url ||
        (item as any)?.cover ||
        (item as any)?.coverUrl ||
        moodBg;

      return (
        <TouchableOpacity
          onPress={() => handlePlay(item)}
          style={styles.itemContainer}
          // acelera composição visual no Android/iOS
          {...(Platform.OS === 'android'
            ? { renderToHardwareTextureAndroid: true }
            : { shouldRasterizeIOS: true })}
        >
         

          <View style={styles.itemOverlay} pointerEvents="none" />

          <View style={styles.itemRow}>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {item.frequency_value ? `${item.frequency_value} Hz ` : ''}
                {item.title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <SvgRightChev />
          </View>
        </TouchableOpacity>
      );
    },
    [handlePlay, moodBg]
  );

  // keyExtractor estável
  const keyExtractor = useCallback((it: FREQUENCY) => it._id, []);

  // getItemLayout reduz custo de medição
  const getItemLayout = useCallback(
    (_: FREQUENCY[] | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // Footer memoizado
  const Footer = useMemo(
    () => (
      <TouchableOpacity style={styles.footer} onPress={() => setCountdownPickerVisible(true)}>
        <Text style={styles.footerText}>All-in-one listening</Text>
        <SvgHeadphones />
      </TouchableOpacity>
    ),
    []
  );

  // Frequencies array estável (evita re-render da FlatList quando o objeto mood muda por ref)
  const frequencies = useMemo(() => mood?.frequencies ?? [], [mood?.frequencies]);

  return (
    <BackgroundWrapper night={false} currentFrequency={{photo_url: moodBg ?? undefined}}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <HeaderWithBack onBack={handleBack} title={mood?.name} />

        {/* <DottedCircle
          size={CIRCLE_SIZE}
          strokeColor="#2D7CFF"
          dotColor="#FFFFFF"
          dotRadius={2}
          spacing={CIRCLE_SIZE / 12}
          style={styles.moodImage}
        /> */}
        <Image
          source={moodIconSource}
          defaultSource={images.mood_placeholder}
          style={styles.moodImage}
        />

        <FlatList
          data={frequencies}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={9}
          removeClippedSubviews
          getItemLayout={getItemLayout}
          // melhora scroll/perf em listas estáveis
          updateCellsBatchingPeriod={50}
          // evita piscar quando muda pouco
          disableVirtualization={false}
          // se os itens tiverem altura realmente fixa:
          // ItemSeparatorComponent={...}
          // ListHeaderComponent={...}
          ListFooterComponent={Footer}
        />

        <CountDownPickerModal
          visible={countdownPickerVisible}
          onClose={setCountdownPickerVisible}
          onConfirm={handleAllInOneListening}
        />
      </SafeAreaView>
    </BackgroundWrapper>
  );
};

export default React.memo(Mood);
