import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from './styles';

type FrequencyCardProps = {
  item: any; // tipa conforme seu FREQUENCY
  onPress: (item: any) => void;
  onRemove?: (item: any) => void;
  showRemove?: boolean;
};

const FrequencyCard: React.FC<FrequencyCardProps> = ({
  item,
  onPress,
  onRemove,
  showRemove,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      {/* Background: cobre TODO o retângulo do card */}
      {item?.background_image ? (
        <FastImage
          source={{ uri: item.background_image }}
          style={styles.cardBgImage}
          resizeMode={FastImage.resizeMode.cover}
          pointerEvents="none"
        />
      ) : null}

      {/* Overlay sutil para legibilidade do texto */}
      <View style={styles.cardOverlay} pointerEvents="none" />

      {/* Conteúdo centralizado sobre a imagem */}
      <View style={styles.centerContent}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {item?.title}
        </Text>
      </View>

      {/* Botão remover (top-right), se existir */}
      {showRemove && onRemove && (
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(item)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default FrequencyCard;
