import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import shortid from 'shortid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './projectStyle';
import {AuthContext} from '../../context';
import {TabScreenHeader, ProjectCard} from '../../components';
import {combineData} from '../../utils/DataHelper';

export function Projects() {
  const tabs = ['All', 'Ongoing', 'Completed'];

  const {state, dispatch} = useContext(AuthContext);
  const {projects} = state;

  const [data, setData] = useState({activeTab: 'All'});

  const toggleTab = tab => {
    setData(combineData(data, {activeTab: tab}));
  };

  const isActiveTab = tab => {
    const value = data?.activeTab === tab;
    return value;
  };

  const getProjects = () => {
    let {activeTab} = data;
    let projectsToRender = [];
    if (activeTab === 'All') {
      projectsToRender = projects;
    } else {
      projectsToRender =
        projects?.filter(
          project => project.status === activeTab?.toLowerCase(),
        ) || [];
    }

    return projectsToRender;
  };

  const EmptyListComponent = () => {
    return (
      <View style={styles.emptyListContainer}>
        <MaterialCommunityIcons name="file" size={120} color="#f4a9a2" />
        <Text style={styles.emptyListText}>None found</Text>
      </View>
    );
  };

  const renderProjectInfo = ({item}) => {
    return <ProjectCard project={item} key={shortid.generate()} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => <Text style={styles.headerTitle}>Projects</Text>}
      />
      <View style={styles.projectsBody}>
        <View style={styles.projectsTabs}>
          {tabs?.map(tab => (
            <TouchableOpacity
              style={[
                styles.projectTab,
                isActiveTab(tab) ? styles.activeProjectTab : null,
              ]}
              onPress={() => toggleTab(tab)}
              key={shortid.generate()}>
              <Text
                style={[
                  styles.projectTabText,
                  isActiveTab(tab)
                    ? styles.activeProjectTabText
                    : styles.inActiveProjectTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {projects?.length > 0 ? (
          <FlatList
            data={getProjects()}
            keyExtractor={(item, index) => shortid.generate()}
            renderItem={renderProjectInfo}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyListComponent />
        )}
      </View>
    </SafeAreaView>
  );
}
