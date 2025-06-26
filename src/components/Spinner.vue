<template>
  <div class="spinner"><span></span></div>
</template>

<style scoped>
.spinner {
  --color: black;
	height: 32px;
	width: 32px;
  margin: 20px;
	-webkit-animation: spinner-1 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: spinner-1 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes spinner-1 {
	0%   { -webkit-transform: rotate(0deg); }
	100% { -webkit-transform: rotate(360deg); }
}
@keyframes spinner-1 {
	0%   { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
.spinner::before {
	content: "";
	display: block;
	position: absolute;
	top: 0; left: 0;
	bottom: 0; right: auto;
	margin: auto;
	width: 8px;
	height: 8px;
	background: var(--color);
	border-radius: 50%;
	-webkit-animation: spinner-2 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: spinner-2 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes spinner-2 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(24px, 0, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes spinner-2 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(24px, 0, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
.spinner::after {
	content: "";
	display: block;
	position: absolute;
	top: 0; left: auto;
	bottom: 0; right: 0;
	margin: auto;
	width: 8px;
	height: 8px;
	background: var(--color);
	border-radius: 50%;
	-webkit-animation: spinner-3 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: spinner-3 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes spinner-3 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(-24px, 0, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes spinner-3 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(-24px, 0, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
.spinner span {
	display: block;
	position: absolute;
	top: 0; left: 0;
	bottom: 0; right: 0;
	margin: auto;
	height: 32px;
	width: 32px;
}
.spinner span::before {
	content: "";
	display: block;
	position: absolute;
	top: 0; left: 0;
	bottom: auto; right: 0;
	margin: auto;
	width: 8px;
	height: 8px;
	background: var(--color);
	border-radius: 50%;
	-webkit-animation: spinner-4 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: spinner-4 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes spinner-4 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(0, 24px, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes spinner-4 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(0, 24px, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
.spinner span::after {
	content: "";
	display: block;
	position: absolute;
	top: auto; left: 0;
	bottom: 0; right: 0;
	margin: auto;
	width: 8px;
	height: 8px;
	background: var(--color);
	border-radius: 50%;
	-webkit-animation: spinner-5 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: spinner-5 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes spinner-5 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(0, -24px, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes spinner-5 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(0, -24px, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
</style>