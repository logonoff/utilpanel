import {
  CaptionButton,
  CaptionMenu,
  CommandBar,
  Dialog,
  Header,
  HeaderText,
  HeaderTitle,
} from '@shalecss/react';

interface SimpleDialogProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const SimpleDialog: React.FC<SimpleDialogProps> = ({
  id,
  title,
  children,
  actions,
}) => {
  return (
    <Dialog id={id} style={{ minWidth: 'min(95vw, 400px)' }}>
      <Header compact>
        <HeaderTitle>
          <HeaderText>{title}</HeaderText>
        </HeaderTitle>
        <CaptionMenu>
          <CaptionButton
            title="Close"
            type="button"
            commandfor={id}
            command="close"
          >
            ×
          </CaptionButton>
        </CaptionMenu>
      </Header>
      {children}
      {actions && (
        <CommandBar variant="space-between" gutter>
          {actions}
        </CommandBar>
      )}
    </Dialog>
  );
};
