import styles from './InstaCard.module.scss';

interface InstaCardProps {
  children: React.ReactNode;
}
const InstaCard: React.FC<InstaCardProps> = (props) => {
  return <div className={styles.card}>{props.children}</div>;
};

export default InstaCard;
