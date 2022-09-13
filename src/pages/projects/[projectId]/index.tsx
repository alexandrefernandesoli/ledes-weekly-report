import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Header,
  LateralMenu,
  ContentContainer,
  Flex,
  MainContainer,
  ReportsContainer,
} from '../../../components';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/AuthContext';
import { FaCalendar, FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';
import { ProjectType, useDataContext } from '../../../lib/DataContext';
import {
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { collection, where } from 'firebase/firestore';
import { database } from '../../../lib/firebaseConfig';
import moment from 'moment';

type ReportType = {
  id: string;
  content: string;
  submittedAt: Date;
  userId: string;
  projectId: string;
};

const reportConverter = {
  toFirestore: (report: WithFieldValue<ReportType>): DocumentData => {
    return {
      id: report.id,
      content: report.content,
      submittedAt: report.submittedAt,
      userId: report.userId,
      projectId: report.projectId,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      content: data.content,
      submittedAt: data.submittedAt.toDate(),
      userId: data.userId,
      projectId: data.projectId,
    } as ReportType;
  },
};

const Project = () => {
  const { authUser, loading } = useAuth();
  const { projects } = useDataContext();
  const [project, setProject] = useState({
    id: '',
    name: '',
    description: '',
    users: {},
  } as ProjectType);
  const [reports, setReports] = useState<ReportType[]>([]);
  const router = useRouter();

  const { projectId } = router.query;

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/');
    }

    if (!loading && authUser) {
      const getReports = async () => {
        const q = query(
          collection(database, 'reports'),
          where('projectId', '==', projectId),
          where('userId', '==', authUser.uid)
        ).withConverter(reportConverter);

        const reportsSnapshot = await getDocs(q);

        const newReports = [] as any[];

        reportsSnapshot.forEach((doc) => {
          newReports.push(doc.data());
        });

        newReports.sort(
          (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
        );

        setReports(newReports);
      };

      setProject(projects.find((proj) => proj.id == projectId) as ProjectType);
      getReports();
    }
  }, [authUser, loading, projects, projectId]);

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <MainContainer>
        <LateralMenu />

        <ContentContainer>
          {project ? (
            <>
              <Flex
                css={{
                  color: 'white',
                  justifyContent: 'center',
                  margin: '12px 0',
                }}
              >
                <h1>{project.name}</h1>
              </Flex>
              <ReportsContainer>
                <Link href={`/projects/${projectId}/new-report`} passHref>
                  <Flex
                    css={{
                      backgroundColor: 'rgba(255,255,255,1)',
                      padding: '8px',
                      borderRadius: 6,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    <FaPlusCircle size={42} color={'rgba(0,0,0,0.1)'} />
                  </Flex>
                </Link>

                {reports.map((report, index) => (
                  <Flex
                    key={report.id}
                    css={{
                      backgroundColor: 'rgba(255,255,255,1)',
                      padding: '8px',
                      borderRadius: 6,
                      flexDirection: 'column',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    <p>{report.content}</p>
                    <span>
                      <FaCalendar />
                      {moment(report.submittedAt).format('DD/MM/YY hh:mm:ss')}
                    </span>
                  </Flex>
                ))}
              </ReportsContainer>
            </>
          ) : (
            <></>
          )}
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default Project;
