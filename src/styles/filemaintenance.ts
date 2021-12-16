import { css } from '@emotion/react'
const styles = {
  box: css`
    margin-bottom: 1em;
    display: flex;
  `,
  link: css`
    text-decoration: none;
  `,
  linkText: css`
    font-family: inherit;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: #000;
    }
  `,
  linkActive: css`
    font-family: inherit;
    color: #0f3b68;
  `,
  tabPanel: css`
    padding-left: 0;
    padding-right: 0;
  `,
  dialogContentLoading: css`
    display: flex;
    justify-content: center;
    margin: 3em 6em;
    height: 3em;
  `,
  boxLabel: css`
    margin-left: 0.5em;
    margin-bottom: 0.5em;
  `,
  boxRoot: css`
    margin-bottom: 1.5em;
    margin-top: 1.5em;
  `,
  divider: css`
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  `,
  boxLoading: css`
    display: flex;
    justify-content: center;
    margin-bottom: 2.5em;
  `,
}

export default styles
