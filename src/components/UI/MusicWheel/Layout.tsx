import React from 'react';
import {View, Dimensions} from 'react-native';
import {
  BottomDottedSeparator,
  LeftDottedSeperator,
  RightDottedSeperator,
  TopDottedSeparator,
} from '../../../utils/seperator';

// Solution using height and alignSelf instead of flex
const FlexibleGridLayout = ({soundOptions, renderItem, styles}) => {
  const screenWidth = Dimensions.get('window').width;
  const containerHeight = screenWidth * 0.85;
  const containerWidth = screenWidth * 0.85;
  const halfWidth = containerWidth / 2;
  const halfHeight = containerWidth / 2;

  const renderGridLayout = () => {
    const totalItems = soundOptions.length;

    if (totalItems === 1) {
      return (
        <View style={{width: containerWidth, height: containerHeight}}>
          {renderItem({item: soundOptions[0], index: 0})}
        </View>
      );
    }

    if (totalItems === 2) {
      return (
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            flexDirection: 'row',
          }}>
          <View style={{width: halfWidth, height: containerHeight}}>
            {renderItem({item: soundOptions[0], index: 0})}
          </View>
          <TopDottedSeparator />

          <BottomDottedSeparator />
          <View style={{width: halfWidth, height: containerHeight}}>
            {renderItem({item: soundOptions[1], index: 1})}
          </View>
        </View>
      );
    }

    if (totalItems === 3) {
      return (
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            flexDirection: 'row',
          }}>
          <View style={{width: halfWidth, height: containerHeight}}>
            <View style={{width: halfWidth, height: halfHeight}}>
              {renderItem({item: soundOptions[0], index: 0})}
            </View>
            <View style={{width: halfWidth, height: halfHeight}}>
              {renderItem({item: soundOptions[2], index: 2})}
            </View>
          </View>
          <View style={{width: halfWidth, height: containerHeight}}>
            {renderItem({item: soundOptions[1], index: 1})}
          </View>
          <TopDottedSeparator />
          <LeftDottedSeperator />
          <BottomDottedSeparator />
        </View>
      );
    }

    // 4 or more items
    return (
      <View style={{width: containerWidth, height: containerHeight}}>
        <View
          style={{
            width: containerWidth,
            height: halfHeight,
            flexDirection: 'row',
          }}>
          <View style={{width: halfWidth, height: halfHeight}}>
            {renderItem({item: soundOptions[0], index: 0})}
          </View>
          <View style={{width: halfWidth, height: halfHeight}}>
            {renderItem({item: soundOptions[1], index: 1})}
          </View>
        </View>
        <View
          style={{
            width: containerWidth,
            height: halfHeight,
            flexDirection: 'row',
          }}>
          <View style={{width: halfWidth, height: halfHeight}}>
            {renderItem({item: soundOptions[2], index: 2})}
          </View>
          <View style={{width: halfWidth, height: halfHeight}}>
            {renderItem({item: soundOptions[3], index: 3})}
          </View>
        </View>
        <TopDottedSeparator />
        <LeftDottedSeperator />
        <RightDottedSeperator />
        <BottomDottedSeparator />
      </View>
    );
  };

  return (
    <View style={[styles.absolute, {height: containerHeight}]}>
      {renderGridLayout()}
    </View>
  );
};

// Alternative with specific heights for different layouts
const FlexibleGridLayoutFlex = ({soundOptions, renderItem, styles}) => {
  const screenWidth = Dimensions.get('window').width;
  const containerHeight = screenWidth * 0.85;
  const containerWidth = screenWidth * 0.85;
  const halfWidth = containerWidth / 2;
  const halfHeight = containerWidth / 2;

  const getItemProps = (index, totalItems) => {
    switch (totalItems) {
      case 1:
        return {
          width: containerWidth,
          height: containerHeight,
          alignSelf: 'center',
        };

      case 2:
        return {
          width: halfWidth,
          height: containerHeight,
          alignSelf: index === 0 ? 'flex-start' : 'flex-end',
        };

      case 3:
        if (index === 0) {
          return {
            width: halfWidth,
            height: halfHeight,
            alignSelf: 'flex-start',
          };
        } else if (index === 1) {
          return {
            width: halfWidth,
            height: containerHeight,
            alignSelf: 'flex-end',
          };
        } else {
          return {
            width: halfWidth,
            height: halfHeight,
            alignSelf: 'flex-start',
          };
        }

      case 4:
      default:
        return {
          width: halfWidth,
          height: halfHeight,
          alignSelf: 'stretch',
        };
    }
  };

  const renderWithCustomProps = (item, index, totalItems) => {
    const itemProps = getItemProps(index, totalItems);

    return (
      <View key={item._id?.toString() || index} style={itemProps}>
        {renderItem({item, index})}
      </View>
    );
  };

  const renderGridLayout = () => {
    const totalItems = soundOptions.length;

    if (totalItems === 1) {
      return renderWithCustomProps(soundOptions[0], 0, totalItems);
    }

    if (totalItems === 2) {
      return (
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            flexDirection: 'row',
          }}>
          {soundOptions.map((item, index) =>
            renderWithCustomProps(item, index, totalItems),
          )}
        </View>
      );
    }

    if (totalItems === 3) {
      return (
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            flexDirection: 'row',
          }}>
          <View style={{width: halfWidth, height: containerHeight}}>
            {renderWithCustomProps(soundOptions[0], 0, totalItems)}
            {renderWithCustomProps(soundOptions[2], 2, totalItems)}
          </View>
          {renderWithCustomProps(soundOptions[1], 1, totalItems)}
        </View>
      );
    }

    // 4 or more items
    return (
      <View style={{width: containerWidth, height: containerHeight}}>
        <View
          style={{
            width: containerWidth,
            height: halfHeight,
            flexDirection: 'row',
          }}>
          {renderWithCustomProps(soundOptions[0], 0, totalItems)}
          {renderWithCustomProps(soundOptions[1], 1, totalItems)}
        </View>
        <View
          style={{
            width: containerWidth,
            height: halfHeight,
            flexDirection: 'row',
          }}>
          {renderWithCustomProps(soundOptions[2], 2, totalItems)}
          {renderWithCustomProps(soundOptions[3], 3, totalItems)}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.absolute, {height: containerHeight}]}>
      {renderGridLayout()}
    </View>
  );
};

export {FlexibleGridLayout, FlexibleGridLayoutFlex};
