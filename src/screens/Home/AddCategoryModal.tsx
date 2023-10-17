import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Modal} from '../../components/Modal';
import {TextContent} from '../../components/TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../ThemeProvider';
import {ICategory} from '../../database/models/category';
import {commonColors} from '../../../themes';
import {v4 as uuid} from 'uuid';
import {TextInput} from '../../components/TextInput';

interface IAddCategoryModal {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  upsertCategory: (category: ICategory) => void;
  deleteCategory: (category: ICategory) => void;
  categoryToUpdate: ICategory | null;
}

export const AddCategoryModal = ({
  isOpen,
  updateVisibility,
  upsertCategory,
  deleteCategory,
  categoryToUpdate,
}: IAddCategoryModal) => {
  const {theme} = useTheme();

  const [category, setCategory] = useState<ICategory>(
    categoryToUpdate || {
      id: uuid(),
      color: commonColors.green,
      icon: 'apps',
      name: 'New Category',
      isCustom: true,
    },
  );

  const [editText, setEditText] = useState(false);
  const [editIcon, setEditIcon] = useState(false);
  const [editColor, setEditColor] = useState(false);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);

  const createCategory = () => {
    upsertCategory(category);
    updateVisibility(false);
  };

  const updateCategory = (updatedCategory: ICategory) => {
    upsertCategory(updatedCategory);
    updateVisibility(false);
  };

  const deleteIt = () => {
    deleteCategory(category);
    updateVisibility(false);
  };

  const borderTopColor = theme.colors.surface[200];

  return (
    <>
      <Modal
        placeContentAtBottom
        isVisible={isOpen}
        updateVisibility={updateVisibility}>
        <View
          style={[
            styles.container,
            {backgroundColor: theme.colors.surface[100]},
          ]}>
          <View style={[styles.previewContainer]}>
            <View>
              <TextContent style={[styles.previewContainerText]}>
                <MaterialCommunityIcons
                  name="checkbox-blank-circle"
                  color={category.color}
                />
                {'  '}
                {category.name}
              </TextContent>
            </View>
            <View>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: category.color},
                ]}>
                <MaterialCommunityIcons
                  name={category.icon}
                  color="#fff"
                  size={24}
                />
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.infoContainer, {borderTopColor}]}
            onPress={() => setEditText(true)}>
            <MaterialCommunityIcons
              name="pencil-outline"
              color={theme.colors.disabledText}
              size={20}
            />
            <TextContent style={[styles.infoContainerText]}>
              Category name
            </TextContent>
          </Pressable>

          <Pressable
            style={[styles.infoContainer, {borderTopColor}]}
            onPress={() => setEditIcon(true)}>
            <MaterialCommunityIcons
              name="image-outline"
              color={theme.colors.disabledText}
              size={20}
            />
            <TextContent style={[styles.infoContainerText]}>
              Category icon
            </TextContent>
          </Pressable>

          <Pressable
            style={[styles.infoContainer, {borderTopColor}]}
            onPress={() => setEditColor(true)}>
            <MaterialCommunityIcons
              name="invert-colors"
              color={theme.colors.disabledText}
              size={20}
            />
            <TextContent style={[styles.infoContainerText]}>
              Category color
            </TextContent>
          </Pressable>

          {Boolean(categoryToUpdate) && (
            <Pressable
              style={[styles.infoContainer, {borderTopColor}]}
              onPress={() => setIsDeleteModelOpen(true)}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                color={theme.colors.disabledText}
                size={20}
              />
              <TextContent style={[styles.infoContainerText]}>
                Delete Category
              </TextContent>
            </Pressable>
          )}

          {!categoryToUpdate && (
            <View style={[styles.actionsContainer, {borderTopColor}]}>
              <Pressable
                onPress={createCategory}
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.surface[100]},
                ]}>
                <TextContent
                  style={[styles.buttonText, {color: category.color}]}>
                  CREATE CATEGORY
                </TextContent>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>

      {editText && (
        <EditText
          isOpen={editText}
          updateVisibility={visibility => {
            setEditText(visibility);
          }}
          updateName={name => {
            if (categoryToUpdate) updateCategory({...category, name});
            else setCategory(prev => ({...prev, name}));
          }}
          name={category.name}
        />
      )}

      {editColor && (
        <EditColor
          isOpen={editColor}
          updateVisibility={visibility => {
            setEditColor(visibility);
          }}
          updateColor={color => {
            if (categoryToUpdate) updateCategory({...category, color});
            else setCategory(prev => ({...prev, color}));
          }}
        />
      )}

      {editIcon && (
        <EditIcon
          isOpen={editIcon}
          updateVisibility={visibility => {
            setEditIcon(visibility);
          }}
          updateIcon={icon => {
            if (categoryToUpdate) updateCategory({...category, icon});
            else setCategory(prev => ({...prev, icon}));
          }}
        />
      )}

      {isDeleteModelOpen && (
        <DeleteCategory
          isOpen={isDeleteModelOpen}
          updateVisibility={visibility => {
            setIsDeleteModelOpen(visibility);
          }}
          deleteId={deleteIt}
        />
      )}
    </>
  );
};

interface IEditText {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateName: (name: string) => void;
  name: string;
}

const EditText = ({isOpen, updateVisibility, updateName, name}: IEditText) => {
  const {theme} = useTheme();

  const [listName, setListName] = useState(name);

  const onClose = () => updateVisibility(false);

  const onOk = () => {
    updateName(listName);
    onClose();
  };

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View style={[styles.nameTextInputContainer]}>
          <View>
            <TextInput
              label="Category name"
              autoFocus={true}
              onChangeText={text => setListName(text)}
              value={name}
              labelBackgroundColor={theme.colors.surface[100]}
            />
          </View>
        </View>
        <View
          style={[
            styles.actionsContainer,
            {borderTopColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={onClose}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>CANCEL</TextContent>
          </Pressable>
          <Pressable
            onPress={onOk}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>OK</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

interface IEditColor {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateColor: (color: string) => void;
}

const EditColor = ({isOpen, updateVisibility, updateColor}: IEditColor) => {
  const {theme} = useTheme();

  const onClose = () => updateVisibility(false);

  const onOk = (color: string) => {
    updateColor(color);
    onClose();
  };

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View
          style={[
            styles.titleContainer,
            {borderBottomColor: theme.colors.surface[200]},
          ]}>
          <TextContent style={[styles.titleText]}>Category color</TextContent>
        </View>
        <ScrollView contentContainerStyle={[styles.scrollContainer]}>
          {Object.values(commonColors).map(backgroundColor => (
            <Pressable
              key={backgroundColor}
              style={[styles.colorContainer]}
              onPress={() => onOk(backgroundColor)}>
              <View style={[styles.colorCircle, {backgroundColor}]} />
            </Pressable>
          ))}
        </ScrollView>
        <View
          style={[
            styles.actionsContainer,
            {borderTopColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={onClose}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>CANCEL</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

interface IEditIcon {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateIcon: (icon: ICategory['icon']) => void;
}

const EditIcon = ({isOpen, updateVisibility, updateIcon}: IEditIcon) => {
  const {theme} = useTheme();

  const onClose = () => updateVisibility(false);

  const onOk = (icon: ICategory['icon']) => {
    updateIcon(icon);
    onClose();
  };

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View
          style={[
            styles.titleContainer,
            {borderBottomColor: theme.colors.surface[200]},
          ]}>
          <TextContent style={[styles.titleText]}>Category icon</TextContent>
        </View>
        <ScrollView contentContainerStyle={[styles.scrollContainer]}>
          {icons.map(icon => (
            <Pressable
              key={icon}
              style={[styles.colorContainer]}
              onPress={() => onOk(icon)}>
              <MaterialCommunityIcons name={icon} size={42} />
            </Pressable>
          ))}
        </ScrollView>
        <View
          style={[
            styles.actionsContainer,
            {borderTopColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={onClose}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>CANCEL</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

interface IDeleteCategory {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  deleteId: () => void;
}

const DeleteCategory = ({
  isOpen,
  updateVisibility,
  deleteId,
}: IDeleteCategory) => {
  const {theme} = useTheme();

  const onNo = () => {
    updateVisibility(false);
  };

  const onYes = () => {
    deleteId();
    updateVisibility(false);
  };

  const color = commonColors.red;

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View style={[styles.nameTextInputContainer]}>
          <View>
            <TextContent style={[styles.deleteQuestion, {color}]}>
              Delete category?
            </TextContent>
          </View>
        </View>
        <View
          style={[
            styles.actionsContainer,
            {borderTopColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={onYes}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText, {color}]}>YES</TextContent>
          </Pressable>
          <Pressable
            onPress={onNo}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>NO</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerEdit: {
    flexDirection: 'column',
    borderRadius: 20,
    maxHeight: 360,
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  infoContainer: {
    width: '100%',
    padding: 16,
    columnGap: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainerText: {
    fontSize: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewContainerText: {fontFamily: 'Inter-Medium', fontSize: 16},
  nameTextInput: {borderWidth: 2, borderRadius: 8},
  nameTextInputContainer: {padding: 16, rowGap: 12},
  colorContainer: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  titleText: {fontFamily: 'Inter-Medium', fontSize: 14},
  deleteQuestion: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});

const icons: ICategory['icon'][] = [
  'account',
  'airplane',
  'alarm',
  'apple',
  'attachment',
  'bank',
  'battery',
  'beer',
  'bell',
  'bike',
  'book',
  'briefcase',
  'bug',
  'bus',
  'cake',
  'camera',
  'cart',
  'cash',
  'chat',
  'check',
  'clock',
  'cloud',
  'coffee',
  'comment',
  'desktop-classic',
  'diamond',
  'email',
  'eye',
  'filmstrip',
  'flag',
  'flask',
  'food',
  'gamepad',
  'gift',
  //   'globe',
  'hammer',
  'heart',
  'home',
  'image',
  'inbox',
  'key',
  'laptop',
  'leaf',
  'lightbulb',
  'lock',
  'map',
  'message',
  'music',
  'note',
  'palette',
  'paperclip',
  'pen',
  'phone',
  //   'pie-chart',
  'pizza',
  'printer',
  'puzzle',
  'rocket',
  'ruler',
  'school',
  'shield',
  'shopping',
  'snowflake',
  'star',
  //   'sun',
  'tag',
  'target',
  'television',
  'tools',
  'train',
  'trophy',
  'umbrella',
  'video',
  'wallet',
  'watch',
  'web',
  'wifi',
  //   'worker',
  'wrench',
  'youtube',
  //   'bag-check',
  'beach',
  //   'bike-sharing',
  'bugle',
  'camera-front',
  'castle',
  'chef-hat',
  'dog',
  'fire',
  'gamepad-variant',
  'golf',
  'headphones',
  'language-python',
  'medical-bag',
  'palm-tree',
  'roller-skate',
  'satellite',
  'silverware',
  'snowman',
  'water',
];
